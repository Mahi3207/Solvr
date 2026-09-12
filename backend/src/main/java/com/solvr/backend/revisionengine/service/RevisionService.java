package com.solvr.backend.revisionengine.service;

import com.solvr.backend.entity.User;
import com.solvr.backend.entity.UserProblemActivity;
import com.solvr.backend.exception.UserNotFoundException;
import com.solvr.backend.repository.UserProblemActivityRepository;
import com.solvr.backend.repository.UserRepository;
import com.solvr.backend.revisionengine.dto.RevisionResponse;
import com.solvr.backend.revisionengine.scheduler.RevisionScheduler;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional
public class RevisionService {

        private final RevisionScheduler revisionScheduler;
        private final UserProblemActivityRepository userProblemActivityRepository;
        private final UserRepository userRepository;

        public RevisionService(
                        RevisionScheduler revisionScheduler,
                        UserProblemActivityRepository userProblemActivityRepository,
                        UserRepository userRepository) {

                this.revisionScheduler = revisionScheduler;
                this.userProblemActivityRepository = userProblemActivityRepository;
                this.userRepository = userRepository;
        }

        public void updateRevision(UserProblemActivity activity) {

                int revisionCount = activity.getRevisionCount();

                revisionCount++;

                activity.setRevisionCount(revisionCount);

                if (Boolean.TRUE.equals(activity.getNeedRevision())) {

                        LocalDateTime nextRevision = revisionScheduler.calculateNextRevision(
                                        revisionCount,
                                        LocalDateTime.now());

                        activity.setNextRevisionDate(nextRevision);

                } else {

                        activity.setNextRevisionDate(null);
                }

                userProblemActivityRepository.save(activity);
        }

        private User getCurrentUser() {

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                String email = authentication.getName();

                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new UserNotFoundException("User not found"));
        }

        /*
         * --------------------------------------------------
         * OVERDUE
         * --------------------------------------------------
         *
         * Only revisions strictly before NOW.
         */
        public List<RevisionResponse> getOverdueRevisions() {

                User currentUser = getCurrentUser();

                LocalDateTime now = LocalDateTime.now();

                return userProblemActivityRepository
                                .findByUserAndNeedRevisionTrue(currentUser)
                                .stream()
                                .filter(activity -> activity.getNextRevisionDate() != null
                                                &&
                                                activity.getNextRevisionDate().isBefore(now))
                                .map(this::mapToResponse)
                                .toList();
        }

        /*
         * --------------------------------------------------
         * DUE TODAY
         * --------------------------------------------------
         *
         * Only revisions from NOW until the end of TODAY.
         *
         * IMPORTANT:
         * A revision that was due earlier today is NOT
         * included here. It belongs to OVERDUE.
         */
        public List<RevisionResponse> getTodayRevisions() {

                User currentUser = getCurrentUser();

                LocalDateTime now = LocalDateTime.now();

                LocalDateTime endOfToday = LocalDate.now().atTime(LocalTime.MAX);

                return userProblemActivityRepository
                                .findByUserAndNeedRevisionTrue(currentUser)
                                .stream()
                                .filter(activity -> {

                                        LocalDateTime nextRevision = activity.getNextRevisionDate();

                                        return nextRevision != null
                                                        &&
                                                        !nextRevision.isBefore(now)
                                                        &&
                                                        !nextRevision.isAfter(endOfToday);
                                })
                                .map(this::mapToResponse)
                                .toList();
        }

        /*
         * --------------------------------------------------
         * UPCOMING
         * --------------------------------------------------
         *
         * Only revisions after TODAY.
         */
        public List<RevisionResponse> getUpcomingRevisions() {

                User currentUser = getCurrentUser();

                LocalDateTime endOfToday = LocalDate.now().atTime(LocalTime.MAX);

                return userProblemActivityRepository
                                .findByUserAndNeedRevisionTrue(currentUser)
                                .stream()
                                .filter(activity -> {

                                        LocalDateTime nextRevision = activity.getNextRevisionDate();

                                        return nextRevision != null
                                                        &&
                                                        nextRevision.isAfter(endOfToday);
                                })
                                .map(this::mapToResponse)
                                .toList();
        }

        private RevisionResponse mapToResponse(
                        UserProblemActivity activity) {

                return new RevisionResponse(

                                activity.getId(),

                                activity.getProblem().getId(),

                                activity.getProblem().getTitle(),

                                activity.getRevisionCount(),

                                activity.getNextRevisionDate(),

                                activity.getNeedRevision(),

                                activity.getMasteryScore());
        }
}