package com.solvr.backend.dashboard.service;

import com.solvr.backend.dashboard.dto.TopicAnalyticsProjection;
import com.solvr.backend.dashboard.dto.TopicAnalyticsResponse;
import com.solvr.backend.entity.User;
import com.solvr.backend.exception.UserNotFoundException;
import com.solvr.backend.repository.UserProblemActivityRepository;
import com.solvr.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class TopicAnalyticsService {

        private final UserProblemActivityRepository userProblemActivityRepository;
        private final UserRepository userRepository;

        public TopicAnalyticsService(
                        UserProblemActivityRepository userProblemActivityRepository,
                        UserRepository userRepository) {

                this.userProblemActivityRepository = userProblemActivityRepository;
                this.userRepository = userRepository;
        }

        // --------------------------------------------------
        // TOPIC ANALYTICS
        // --------------------------------------------------

        public List<TopicAnalyticsResponse> getTopicAnalytics() {

                User currentUser = getCurrentUser();

                List<TopicAnalyticsProjection> analytics = userProblemActivityRepository.getTopicAnalytics(currentUser);

                return analytics.stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // --------------------------------------------------
        // PRIVATE HELPERS
        // --------------------------------------------------

        private User getCurrentUser() {

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                String email = authentication.getName();

                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new UserNotFoundException("User not found"));
        }

        private TopicAnalyticsResponse mapToResponse(
                        TopicAnalyticsProjection projection) {

                double completionPercentage = projection.getTotalProblems() == 0
                                ? 0.0
                                : (projection.getSolvedProblems() * 100.0)
                                                / projection.getTotalProblems();

                return new TopicAnalyticsResponse(

                                projection.getTopicId(),

                                projection.getTopicName(),

                                projection.getTotalProblems().intValue(),

                                projection.getAttemptedProblems().intValue(),

                                projection.getSolvedProblems().intValue(),

                                completionPercentage,

                                projection.getAverageMastery() == null
                                                ? 0.0
                                                : projection.getAverageMastery());
        }
}