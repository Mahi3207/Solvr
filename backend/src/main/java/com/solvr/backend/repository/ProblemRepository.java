package com.solvr.backend.repository;

import com.solvr.backend.entity.Problem;
import com.solvr.backend.enums.Platform;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProblemRepository extends JpaRepository<Problem, Long> {

    Optional<Problem> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsByTitleIgnoreCaseAndPlatform(
            String title,
            Platform platform
    );
    List<Problem> findByActiveTrue();
    List<Problem> findByTitleContainingIgnoreCaseAndActiveTrue(String keyword);
    long countByActiveTrue();
}