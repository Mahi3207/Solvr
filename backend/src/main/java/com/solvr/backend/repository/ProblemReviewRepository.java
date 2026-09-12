package com.solvr.backend.repository;

import com.solvr.backend.entity.ProblemReview;
import com.solvr.backend.entity.UserProblemActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProblemReviewRepository
        extends JpaRepository<ProblemReview, Long> {

    List<ProblemReview> findByUserProblemActivityOrderByReviewDateDesc(
            UserProblemActivity userProblemActivity
    );

}