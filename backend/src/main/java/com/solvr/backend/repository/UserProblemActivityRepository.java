package com.solvr.backend.repository;

import com.solvr.backend.dashboard.dto.TopicAnalyticsProjection;
import com.solvr.backend.entity.Problem;
import com.solvr.backend.entity.User;
import com.solvr.backend.entity.UserProblemActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.solvr.backend.enums.ProblemStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserProblemActivityRepository
                extends JpaRepository<UserProblemActivity, Long> {

        Optional<UserProblemActivity> findByUserAndProblem(
                        User user,
                        Problem problem);

        List<UserProblemActivity> findByUser(User user);

        void deleteByUser(User user);

        List<UserProblemActivity> findByUserAndBookmarkedTrue(User user);

        List<UserProblemActivity> findByUserAndFavouriteTrue(User user);

        List<UserProblemActivity> findByUserAndStatus(
                        User user,
                        ProblemStatus status);

        boolean existsByUserAndProblem(
                        User user,
                        Problem problem);

        List<UserProblemActivity> findByUserOrderByUpdatedAtDesc(User user);

        List<UserProblemActivity> findByUserAndStatusOrderByUpdatedAtDesc(
                        User user,
                        ProblemStatus status);

        List<UserProblemActivity> findByUserAndBookmarkedTrueOrderByUpdatedAtDesc(
                        User user);

        List<UserProblemActivity> findByUserAndFavouriteTrueOrderByUpdatedAtDesc(
                        User user);

        List<UserProblemActivity> findByUserAndNeedRevisionTrueOrderByUpdatedAtDesc(
                        User user);

        List<UserProblemActivity> findByUserAndNeedRevisionTrue(User user);

        List<UserProblemActivity> findByUserAndNextRevisionDateBefore(User user, LocalDateTime dateTime);

        List<UserProblemActivity> findByUserAndNextRevisionDateAfter(User user, LocalDateTime dateTime);

        List<UserProblemActivity> findByUserAndNextRevisionDate(User user, LocalDateTime dateTime);

        List<UserProblemActivity> findByUserAndNeedRevisionTrueAndNextRevisionDate(
                        User user,
                        LocalDate nextRevisionDate);

        List<UserProblemActivity> findByUserAndNeedRevisionTrueAndNextRevisionDateBefore(
                        User user,
                        LocalDateTime date);

        List<UserProblemActivity> findByUserAndNeedRevisionTrueAndNextRevisionDateAfter(
                        User user,
                        LocalDateTime date);

        List<UserProblemActivity> findByUserAndNeedRevisionTrueAndNextRevisionDateBetween(
                        User user,
                        LocalDateTime start,
                        LocalDateTime end);

        @Query("""
                        SELECT new com.solvr.backend.dashboard.dto.TopicAnalyticsProjection(
                            t.id,
                            t.name,
                            COUNT(p.id),
                            SUM(
                                CASE
                                    WHEN a.status IS NOT NULL
                                         AND a.status <> com.solvr.backend.enums.ProblemStatus.NOT_STARTED
                                    THEN 1
                                    ELSE 0
                                END
                            ),
                            SUM(
                                CASE
                                    WHEN a.status = com.solvr.backend.enums.ProblemStatus.SOLVED
                                    THEN 1
                                    ELSE 0
                                END
                            ),
                            AVG(a.masteryScore)
                        )
                        FROM Topic t
                        JOIN Problem p ON p.topic = t
                        LEFT JOIN UserProblemActivity a
                            ON a.problem = p
                            AND a.user = :user
                        WHERE t.active = true
                          AND p.active = true
                        GROUP BY t.id, t.name
                        ORDER BY t.name
                        """)
        List<TopicAnalyticsProjection> getTopicAnalytics(User user);
}