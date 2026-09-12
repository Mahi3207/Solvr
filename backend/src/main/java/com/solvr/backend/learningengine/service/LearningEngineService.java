package com.solvr.backend.learningengine.service;

import com.solvr.backend.entity.Problem;
import com.solvr.backend.entity.ProblemReview;
import com.solvr.backend.entity.User;
import com.solvr.backend.entity.UserProblemActivity;
import com.solvr.backend.exception.UserNotFoundException;
import com.solvr.backend.exception.UserProblemActivityNotFoundException;
import com.solvr.backend.learningengine.aggregator.MasteryAggregator;
import com.solvr.backend.learningengine.calculator.ConfidenceCalculator;
import com.solvr.backend.learningengine.calculator.ConsistencyCalculator;
import com.solvr.backend.learningengine.calculator.RetentionCalculator;
import com.solvr.backend.learningengine.calculator.UnderstandingCalculator;
import com.solvr.backend.learningengine.dto.MasteryBreakdown;
import com.solvr.backend.learningengine.normalizer.AttemptNormalizer;
import com.solvr.backend.learningengine.normalizer.ConfidenceNormalizer;
import com.solvr.backend.learningengine.normalizer.RevisionNormalizer;
import com.solvr.backend.learningengine.normalizer.StatusNormalizer;
import com.solvr.backend.learningengine.normalizer.TimeNormalizer;
import com.solvr.backend.learningengine.rules.MasteryRuleEngine;
import com.solvr.backend.repository.ProblemReviewRepository;
import com.solvr.backend.repository.UserProblemActivityRepository;
import com.solvr.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Single entry point for Phase 4 -- the Learning Engine.
 *
 * Responsibilities:
 * - Receive a UserProblemActivity (by id)
 * - Call all normalizers
 * - Call all dimension calculators
 * - Call the aggregator
 * - Apply business rules
 * - Persist the resulting mastery score
 * - Return a transparent MasteryBreakdown
 *
 * This service purely orchestrates. It contains no formulas, no
 * normalization logic, and no business rules of its own -- those all
 * live in their dedicated, independently testable components.
 */
@Service
@Transactional
public class LearningEngineService {

        private final UserProblemActivityRepository userProblemActivityRepository;
        private final ProblemReviewRepository problemReviewRepository;
        private final UserRepository userRepository;

        private final StatusNormalizer statusNormalizer;
        private final AttemptNormalizer attemptNormalizer;
        private final TimeNormalizer timeNormalizer;
        private final ConfidenceNormalizer confidenceNormalizer;
        private final RevisionNormalizer revisionNormalizer;

        private final UnderstandingCalculator understandingCalculator;
        private final RetentionCalculator retentionCalculator;
        private final ConfidenceCalculator confidenceCalculator;
        private final ConsistencyCalculator consistencyCalculator;

        private final MasteryAggregator masteryAggregator;
        private final MasteryRuleEngine masteryRuleEngine;

        public LearningEngineService(
                        UserProblemActivityRepository userProblemActivityRepository,
                        ProblemReviewRepository problemReviewRepository,
                        UserRepository userRepository,
                        StatusNormalizer statusNormalizer,
                        AttemptNormalizer attemptNormalizer,
                        TimeNormalizer timeNormalizer,
                        ConfidenceNormalizer confidenceNormalizer,
                        RevisionNormalizer revisionNormalizer,
                        UnderstandingCalculator understandingCalculator,
                        RetentionCalculator retentionCalculator,
                        ConfidenceCalculator confidenceCalculator,
                        ConsistencyCalculator consistencyCalculator,
                        MasteryAggregator masteryAggregator,
                        MasteryRuleEngine masteryRuleEngine) {

                this.userProblemActivityRepository = userProblemActivityRepository;
                this.problemReviewRepository = problemReviewRepository;
                this.userRepository = userRepository;

                this.statusNormalizer = statusNormalizer;
                this.attemptNormalizer = attemptNormalizer;
                this.timeNormalizer = timeNormalizer;
                this.confidenceNormalizer = confidenceNormalizer;
                this.revisionNormalizer = revisionNormalizer;

                this.understandingCalculator = understandingCalculator;
                this.retentionCalculator = retentionCalculator;
                this.confidenceCalculator = confidenceCalculator;
                this.consistencyCalculator = consistencyCalculator;

                this.masteryAggregator = masteryAggregator;
                this.masteryRuleEngine = masteryRuleEngine;
        }

        // --------------------------------------------------
        // PUBLIC ENTRY POINT
        // --------------------------------------------------

        public MasteryBreakdown calculateMastery(Long activityId) {

                UserProblemActivity activity = getOwnedActivity(activityId);

                List<ProblemReview> reviews = problemReviewRepository
                                .findByUserProblemActivityOrderByReviewDateDesc(activity);

                // Step 1: Signal Normalization
                double statusScore = statusNormalizer.normalize(activity.getStatus());
                double attemptScore = attemptNormalizer.normalize(activity.getAttemptCount());
                double timeScore = timeNormalizer.normalize(
                                activity.getTimeSpent(),
                                getEstimatedTime(activity));
                double confidenceScore = confidenceNormalizer.normalize(activity.getConfidenceLevel());
                double revisionScore = revisionNormalizer.normalize(
                                activity.getRevisionCount(),
                                activity.getNeedRevision());

                // Step 2: Learning Dimension Calculators
                double understanding = understandingCalculator.calculate(
                                statusScore, attemptScore, timeScore);

                double retention = retentionCalculator.calculate(revisionScore, reviews);

                double confidence = confidenceCalculator.calculate(confidenceScore, statusScore);

                double consistency = consistencyCalculator.calculate(reviews);

                // Step 3: Mastery Aggregator
                double aggregatedScore = masteryAggregator.aggregate(
                                understanding, retention, confidence, consistency);

                // Step 4: Business Rules
                double finalScore = masteryRuleEngine.applyRules(activity, aggregatedScore);

                // Step 5: Persist
                persistMasteryScore(activity, finalScore);

                return buildBreakdown(
                                activity, understanding, retention, confidence, consistency, finalScore);
        }

        // --------------------------------------------------
        // PRIVATE HELPERS
        // --------------------------------------------------

        private UserProblemActivity getOwnedActivity(Long activityId) {

                User currentUser = getCurrentUser();

                UserProblemActivity activity = userProblemActivityRepository
                                .findById(activityId)
                                .orElseThrow(() -> new UserProblemActivityNotFoundException(
                                                "Activity not found with id: " + activityId));

                if (!activity.getUser().getId().equals(currentUser.getId())) {
                        throw new UserProblemActivityNotFoundException("Activity not found");
                }

                return activity;
        }

        private User getCurrentUser() {

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                String email = authentication.getName();

                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new UserNotFoundException("User not found"));
        }

        private Integer getEstimatedTime(UserProblemActivity activity) {

                Problem problem = activity.getProblem();

                return problem != null ? problem.getEstimatedTime() : null;
        }

        private void persistMasteryScore(UserProblemActivity activity, double finalScore) {

                activity.setMasteryScore(finalScore);
                activity.setLastMasteryCalculatedAt(LocalDateTime.now());

                userProblemActivityRepository.save(activity);
        }

        private MasteryBreakdown buildBreakdown(
                        UserProblemActivity activity,
                        double understanding,
                        double retention,
                        double confidence,
                        double consistency,
                        double finalScore) {

                return new MasteryBreakdown(
                                activity.getId(),
                                activity.getProblem().getId(),
                                understanding,
                                retention,
                                confidence,
                                consistency,
                                finalScore,
                                LocalDateTime.now());
        }
}
