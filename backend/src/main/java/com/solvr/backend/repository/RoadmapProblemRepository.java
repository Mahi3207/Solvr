package com.solvr.backend.repository;

import com.solvr.backend.entity.Problem;
import com.solvr.backend.entity.Roadmap;
import com.solvr.backend.entity.RoadmapProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapProblemRepository extends JpaRepository<RoadmapProblem, Long> {

    boolean existsByRoadmapAndProblem(Roadmap roadmap, Problem problem);

    List<RoadmapProblem> findByRoadmapOrderByDisplayOrderAsc(Roadmap roadmap);

}