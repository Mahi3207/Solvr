package com.solvr.backend.controller;

import com.solvr.backend.dto.ApiResponse;
import com.solvr.backend.dto.roadmapproblem.AddProblemToRoadmapRequest;
import com.solvr.backend.dto.roadmapproblem.RoadmapProblemResponse;
import com.solvr.backend.dto.roadmapproblem.UpdateRoadmapProblemRequest;
import com.solvr.backend.service.RoadmapProblemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RoadmapProblemController {

        private final RoadmapProblemService roadmapProblemService;

        public RoadmapProblemController(RoadmapProblemService roadmapProblemService) {
                this.roadmapProblemService = roadmapProblemService;
        }

        @PostMapping("/roadmaps/{roadmapId}/problems")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<RoadmapProblemResponse>> addProblemToRoadmap(
                        @PathVariable Long roadmapId,
                        @Valid @RequestBody AddProblemToRoadmapRequest request) {

                RoadmapProblemResponse response = roadmapProblemService.addProblemToRoadmap(roadmapId, request);

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(new ApiResponse<>(
                                                true,
                                                "Problem added to roadmap successfully",
                                                response));
        }

        @GetMapping("/roadmaps/{roadmapId}/problems")
        public ResponseEntity<ApiResponse<List<RoadmapProblemResponse>>> getProblemsByRoadmap(
                        @PathVariable Long roadmapId) {

                List<RoadmapProblemResponse> response = roadmapProblemService.getProblemsByRoadmap(roadmapId);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Roadmap problems fetched successfully",
                                                response));
        }

        @GetMapping("/roadmap-problems/{id}")
        public ResponseEntity<ApiResponse<RoadmapProblemResponse>> getRoadmapProblemById(
                        @PathVariable Long id) {

                RoadmapProblemResponse response = roadmapProblemService.getRoadmapProblemById(id);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Roadmap problem fetched successfully",
                                                response));
        }

        @PutMapping("/roadmap-problems/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<RoadmapProblemResponse>> updateRoadmapProblem(
                        @PathVariable Long id,
                        @Valid @RequestBody UpdateRoadmapProblemRequest request) {

                RoadmapProblemResponse response = roadmapProblemService.updateRoadmapProblem(id, request);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Roadmap problem updated successfully",
                                                response));
        }

        @DeleteMapping("/roadmap-problems/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<String>> deleteRoadmapProblem(
                        @PathVariable Long id) {

                roadmapProblemService.deleteRoadmapProblem(id);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Problem removed from roadmap successfully",
                                                null));
        }
}