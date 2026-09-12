package com.solvr.backend.service;

import com.solvr.backend.dto.problemreview.CreateProblemReviewRequest;
import com.solvr.backend.dto.problemreview.ProblemReviewResponse;
import com.solvr.backend.entity.*;
import com.solvr.backend.enums.ProblemStatus;
import com.solvr.backend.exception.*;
import com.solvr.backend.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.solvr.backend.learningengine.service.LearningEngineService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.solvr.backend.revisionengine.service.RevisionService;

@Service
@Transactional
public class ProblemReviewService {

        private final ProblemReviewRepository problemReviewRepository;
        private final UserProblemActivityRepository userProblemActivityRepository;
        private final UserRepository userRepository;
        private final ProblemRepository problemRepository;
        private final LearningEngineService learningEngineService;
        private final RevisionService revisionService;

        public ProblemReviewService(
                        ProblemReviewRepository problemReviewRepository,
                        UserProblemActivityRepository userProblemActivityRepository,
                        UserRepository userRepository,
                        ProblemRepository problemRepository,
                        LearningEngineService learningEngineService,
                        RevisionService revisionService) {

                this.problemReviewRepository = problemReviewRepository;
                this.userProblemActivityRepository = userProblemActivityRepository;
                this.userRepository = userRepository;
                this.problemRepository = problemRepository;
                this.learningEngineService = learningEngineService;
                this.revisionService = revisionService;
        }
        // --------------------------------------------------
        // CREATE
        // --------------------------------------------------

        public ProblemReviewResponse createReview(
                        CreateProblemReviewRequest request) {
                User user = getCurrentUser();

                Problem problem = getProblemEntity(request.getProblemId());

                UserProblemActivity activity = getUserProblemActivity(user, problem);

                ProblemReview review = new ProblemReview();

                review.setUserProblemActivity(activity);
                review.setStatus(request.getStatus());
                review.setAttemptCount(request.getAttemptCount());
                review.setTimeSpent(request.getTimeSpent());
                review.setConfidenceLevel(request.getConfidenceLevel());
                review.setDifficultyRating(request.getDifficultyRating());
                review.setNeedRevision(request.getNeedRevision());
                review.setMistakeType(request.getMistakeType());
                review.setNotes(request.getNotes());
                review.setFavoriteAttempt(request.getFavoriteAttempt());

                ProblemReview savedReview = problemReviewRepository.save(review);

                // ---------------------------------
                // Update Current Activity Snapshot
                // ---------------------------------

                activity.setStatus(request.getStatus());

                activity.setAttemptCount(
                                activity.getAttemptCount() + request.getAttemptCount());

                activity.setTimeSpent(
                                activity.getTimeSpent() + request.getTimeSpent());

                activity.setConfidenceLevel(request.getConfidenceLevel());

                activity.setDifficultyRating(request.getDifficultyRating());

                activity.setNotes(request.getNotes());

                activity.setFavourite(request.getFavoriteAttempt());

                activity.setNeedRevision(request.getNeedRevision());

                if (request.getStatus() == ProblemStatus.SOLVED
                                && activity.getSolvedAt() == null) {

                        activity.setSolvedAt(LocalDateTime.now());
                }

                userProblemActivityRepository.save(activity);
                revisionService.updateRevision(activity);
                learningEngineService.calculateMastery(activity.getId());

                return mapToResponse(savedReview);
        }
        // --------------------------------------------------
        // READ
        // --------------------------------------------------

        public ProblemReviewResponse getReviewById(Long id) {

                ProblemReview review = getReviewEntity(id);

                User currentUser = getCurrentUser();

                if (!review.getUserProblemActivity()
                                .getUser()
                                .getId()
                                .equals(currentUser.getId())) {

                        throw new ProblemReviewNotFoundException(
                                        "Review not found");
                }

                return mapToResponse(review);
        }

        public List<ProblemReviewResponse> getReviewsByProblem(Long problemId) {

                User currentUser = getCurrentUser();

                Problem problem = getProblemEntity(problemId);

                UserProblemActivity activity = getUserProblemActivity(currentUser, problem);

                return problemReviewRepository
                                .findByUserProblemActivityOrderByReviewDateDesc(activity)
                                .stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }
        // --------------------------------------------------
        // DELETE
        // --------------------------------------------------

        public void deleteReview(Long id) {

                ProblemReview review = getReviewEntity(id);

                User currentUser = getCurrentUser();

                if (!review.getUserProblemActivity()
                                .getUser()
                                .getId()
                                .equals(currentUser.getId())) {

                        throw new ProblemReviewNotFoundException(
                                        "Review not found");
                }

                problemReviewRepository.delete(review);
        }
        // --------------------------------------------------
        // PRIVATE HELPERS
        // --------------------------------------------------

        private User getCurrentUser() {

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                String email = authentication.getName();

                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "User not found"));
        }

        private Problem getProblemEntity(Long id) {

                return problemRepository.findById(id)
                                .orElseThrow(() -> new ProblemNotFoundException(
                                                "Problem not found with id: " + id));
        }

        private UserProblemActivity getUserProblemActivity(
                        User user,
                        Problem problem) {

                return userProblemActivityRepository
                                .findByUserAndProblem(user, problem)
                                .orElseThrow(() -> new UserProblemActivityNotFoundException(
                                                "Activity not found"));
        }

        private ProblemReview getReviewEntity(Long id) {

                return problemReviewRepository.findById(id)
                                .orElseThrow(() -> new ProblemReviewNotFoundException(
                                                "Review not found with id: " + id));
        }

        private ProblemReviewResponse mapToResponse(
                        ProblemReview review) {

                return new ProblemReviewResponse(

                                review.getId(),

                                review.getUserProblemActivity()
                                                .getProblem()
                                                .getId(),

                                review.getUserProblemActivity()
                                                .getProblem()
                                                .getTitle(),

                                review.getStatus(),

                                review.getAttemptCount(),

                                review.getTimeSpent(),

                                review.getConfidenceLevel(),

                                review.getDifficultyRating(),

                                review.getNeedRevision(),

                                review.getMistakeType(),

                                review.getNotes(),

                                review.getFavoriteAttempt(),

                                review.getReviewDate(),

                                review.getCreatedAt());
        }
}
