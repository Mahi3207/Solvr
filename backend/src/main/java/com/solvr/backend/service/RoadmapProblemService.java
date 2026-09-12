package com.solvr.backend.service;

import com.solvr.backend.dto.roadmapproblem.AddProblemToRoadmapRequest;
import com.solvr.backend.dto.roadmapproblem.RoadmapProblemResponse;
import com.solvr.backend.dto.roadmapproblem.UpdateRoadmapProblemRequest;
import com.solvr.backend.entity.Problem;
import com.solvr.backend.entity.Roadmap;
import com.solvr.backend.entity.RoadmapProblem;
import com.solvr.backend.exception.ProblemNotFoundException;
import com.solvr.backend.exception.RoadmapNotFoundException;
import com.solvr.backend.exception.RoadmapProblemAlreadyExistsException;
import com.solvr.backend.exception.RoadmapProblemNotFoundException;
import com.solvr.backend.repository.ProblemRepository;
import com.solvr.backend.repository.RoadmapProblemRepository;
import com.solvr.backend.repository.RoadmapRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoadmapProblemService {

        private final RoadmapProblemRepository roadmapProblemRepository;
        private final RoadmapRepository roadmapRepository;
        private final ProblemRepository problemRepository;

        public RoadmapProblemService(
                        RoadmapProblemRepository roadmapProblemRepository,
                        RoadmapRepository roadmapRepository,
                        ProblemRepository problemRepository) {

                this.roadmapProblemRepository = roadmapProblemRepository;
                this.roadmapRepository = roadmapRepository;
                this.problemRepository = problemRepository;
        }

        // --------------------------------------------------
        // CREATE
        // --------------------------------------------------

        public RoadmapProblemResponse addProblemToRoadmap(
                        Long roadmapId,
                        AddProblemToRoadmapRequest request) {

                Roadmap roadmap = getRoadmapEntity(roadmapId);

                Problem problem = getProblemEntity(request.getProblemId());

                if (roadmapProblemRepository.existsByRoadmapAndProblem(roadmap, problem)) {
                        throw new RoadmapProblemAlreadyExistsException(
                                        "Problem already exists in this roadmap");
                }

                RoadmapProblem roadmapProblem = new RoadmapProblem();

                roadmapProblem.setRoadmap(roadmap);
                roadmapProblem.setProblem(problem);
                roadmapProblem.setDisplayOrder(request.getDisplayOrder());

                RoadmapProblem savedRoadmapProblem = roadmapProblemRepository.save(roadmapProblem);

                return mapToResponse(savedRoadmapProblem);
        }
        // --------------------------------------------------
        // READ
        // --------------------------------------------------

        public List<RoadmapProblemResponse> getProblemsByRoadmap(Long roadmapId) {

                Roadmap roadmap = getRoadmapEntity(roadmapId);

                return roadmapProblemRepository
                                .findByRoadmapOrderByDisplayOrderAsc(roadmap)
                                .stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        public RoadmapProblemResponse getRoadmapProblemById(Long id) {

                RoadmapProblem roadmapProblem = getRoadmapProblemEntity(id);

                return mapToResponse(roadmapProblem);
        }
        // --------------------------------------------------
        // UPDATE
        // --------------------------------------------------

        public RoadmapProblemResponse updateRoadmapProblem(
                        Long id,
                        UpdateRoadmapProblemRequest request) {

                RoadmapProblem roadmapProblem = getRoadmapProblemEntity(id);

                roadmapProblem.setDisplayOrder(request.getDisplayOrder());

                RoadmapProblem updatedRoadmapProblem = roadmapProblemRepository.save(roadmapProblem);

                return mapToResponse(updatedRoadmapProblem);
        }

        // --------------------------------------------------
        // DELETE
        // --------------------------------------------------

        public void deleteRoadmapProblem(Long id) {

                RoadmapProblem roadmapProblem = getRoadmapProblemEntity(id);

                roadmapProblemRepository.delete(roadmapProblem);
        }
        // --------------------------------------------------
        // PRIVATE HELPERS
        // --------------------------------------------------

        private Roadmap getRoadmapEntity(Long id) {

                return roadmapRepository.findById(id)
                                .orElseThrow(() -> new RoadmapNotFoundException(
                                                "Roadmap not found with id: " + id));
        }

        private Problem getProblemEntity(Long id) {

                return problemRepository.findById(id)
                                .orElseThrow(() -> new ProblemNotFoundException(
                                                "Problem not found with id: " + id));
        }

        private RoadmapProblem getRoadmapProblemEntity(Long id) {

                return roadmapProblemRepository.findById(id)
                                .orElseThrow(() -> new RoadmapProblemNotFoundException(
                                                "Roadmap problem not found with id: " + id));
        }

        private RoadmapProblemResponse mapToResponse(RoadmapProblem roadmapProblem) {

                return new RoadmapProblemResponse(
                                roadmapProblem.getId(),
                                roadmapProblem.getRoadmap().getId(),
                                roadmapProblem.getRoadmap().getTitle(),
                                roadmapProblem.getProblem().getId(),
                                roadmapProblem.getProblem().getTitle(),
                                roadmapProblem.getDisplayOrder(),
                                roadmapProblem.getCreatedAt());
        }
}
