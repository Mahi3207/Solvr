package com.solvr.backend.controller;

import com.solvr.backend.dto.ApiResponse;
import com.solvr.backend.dto.roadmap.CreateRoadmapRequest;
import com.solvr.backend.dto.roadmap.RoadmapResponse;
import com.solvr.backend.dto.roadmap.UpdateRoadmapRequest;
import com.solvr.backend.service.RoadmapService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roadmaps")
public class RoadmapController {

        private final RoadmapService roadmapService;

        public RoadmapController(RoadmapService roadmapService) {
                this.roadmapService = roadmapService;
        }

        @PostMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<RoadmapResponse>> createRoadmap(
                        @Valid @RequestBody CreateRoadmapRequest request) {

                RoadmapResponse response = roadmapService.createRoadmap(request);

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(new ApiResponse<>(
                                                true,
                                                "Roadmap created successfully",
                                                response));
        }

        @GetMapping
        public ResponseEntity<ApiResponse<List<RoadmapResponse>>> getAllRoadmaps() {

                List<RoadmapResponse> response = roadmapService.getAllRoadmaps();

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Roadmaps fetched successfully",
                                                response));
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<RoadmapResponse>> getRoadmapById(
                        @PathVariable Long id) {

                RoadmapResponse response = roadmapService.getRoadmapById(id);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Roadmap fetched successfully",
                                                response));
        }

        @PutMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<RoadmapResponse>> updateRoadmap(
                        @PathVariable Long id,
                        @Valid @RequestBody UpdateRoadmapRequest request) {

                RoadmapResponse response = roadmapService.updateRoadmap(id, request);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Roadmap updated successfully",
                                                response));
        }

        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<String>> deleteRoadmap(
                        @PathVariable Long id) {

                roadmapService.deleteRoadmap(id);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Roadmap deleted successfully",
                                                null));
        }
}
