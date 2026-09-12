package com.solvr.backend.dashboard.service;

import com.solvr.backend.dashboard.dto.DashboardResponse;
import com.solvr.backend.entity.User;
import com.solvr.backend.entity.UserProblemActivity;
import com.solvr.backend.enums.ProblemStatus;
import com.solvr.backend.exception.UserNotFoundException;
import com.solvr.backend.repository.ProblemRepository;
import com.solvr.backend.repository.UserProblemActivityRepository;
import com.solvr.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;
import com.solvr.backend.dashboard.dto.TopicAnalyticsProjection;
import com.solvr.backend.dashboard.dto.TopicAnalyticsResponse;

import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

        private final ProblemRepository problemRepository;
        private final UserProblemActivityRepository userProblemActivityRepository;
        private final UserRepository userRepository;

        public DashboardService(
                        ProblemRepository problemRepository,
                        UserProblemActivityRepository userProblemActivityRepository,
                        UserRepository userRepository) {

                this.problemRepository = problemRepository;
                this.userProblemActivityRepository = userProblemActivityRepository;
                this.userRepository = userRepository;
        }

        public List<TopicAnalyticsResponse> getTopicAnalytics() {

                User currentUser = getCurrentUser();

                List<TopicAnalyticsProjection> analytics = userProblemActivityRepository.getTopicAnalytics(currentUser);

                return analytics.stream()
                                .map(this::mapToTopicAnalyticsResponse)
                                .collect(Collectors.toList());
        }
        // --------------------------------------------------
        // DASHBOARD SUMMARY
        // --------------------------------------------------

        public DashboardResponse getDashboard() {

                User currentUser = getCurrentUser();

                List<UserProblemActivity> activities = userProblemActivityRepository.findByUser(currentUser);

                int totalProblems = (int) problemRepository.countByActiveTrue();

                int solvedProblems = (int) activities.stream()
                                .filter(activity -> activity.getStatus() == ProblemStatus.SOLVED)
                                .count();

                int attemptedProblems = (int) activities.stream()
                                .filter(activity -> activity.getStatus() != ProblemStatus.NOT_STARTED)
                                .count();

                int masteredProblems = (int) activities.stream()
                                .filter(activity -> activity.getStatus() == ProblemStatus.MASTERED)
                                .count();

                int notStartedProblems = totalProblems - attemptedProblems;

                double overallProgress = totalProblems == 0
                                ? 0.0
                                : (solvedProblems * 100.0) / totalProblems;

                double overallMastery = activities.stream()
                                .map(UserProblemActivity::getMasteryScore)
                                .filter(Objects::nonNull)
                                .mapToDouble(Double::doubleValue)
                                .average()
                                .orElse(0.0);

                LocalDateTime start = LocalDate.now().atStartOfDay();
                LocalDateTime end = LocalDate.now().atTime(LocalTime.MAX);

                int revisionDueToday = userProblemActivityRepository
                                .findByUserAndNeedRevisionTrueAndNextRevisionDateBetween(
                                                currentUser,
                                                start,
                                                end)
                                .size();

                return new DashboardResponse(

                                totalProblems,

                                solvedProblems,

                                attemptedProblems,

                                masteredProblems,

                                notStartedProblems,

                                overallProgress,

                                overallMastery,

                                revisionDueToday);
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

        private TopicAnalyticsResponse mapToTopicAnalyticsResponse(
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