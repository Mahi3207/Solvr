package com.solvr.backend.repository;

import com.solvr.backend.entity.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {

    boolean existsByTitleIgnoreCase(String title);

    List<Roadmap> findByActiveTrue();
    List<Roadmap> findByTitleContainingIgnoreCaseAndActiveTrue(String keyword);
}