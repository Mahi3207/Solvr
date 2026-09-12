package com.solvr.backend.controller;

import com.solvr.backend.dto.problem.CreateProblemRequest;
import com.solvr.backend.dto.problem.ProblemResponse;
import com.solvr.backend.dto.problem.UpdateProblemRequest;
import com.solvr.backend.dto.ApiResponse;
import com.solvr.backend.service.ProblemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

        private final ProblemService problemService;

        public ProblemController(
                        ProblemService problemService) {
                this.problemService = problemService;
        }

        @PostMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<ProblemResponse>> createProblem(
                        @Valid @RequestBody CreateProblemRequest request) {

                ProblemResponse response = problemService.createProblem(request);

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(new ApiResponse<>(
                                                true,
                                                "Problem created successfully",
                                                response));
        }

        @GetMapping
        @PreAuthorize("isAuthenticated()")
        public ResponseEntity<ApiResponse<List<ProblemResponse>>> getAllProblems() {

                List<ProblemResponse> response = problemService.getAllProblems();

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Problems fetched successfully",
                                                response));
        }

        @GetMapping("/{id}")
        @PreAuthorize("isAuthenticated()")
        public ResponseEntity<ApiResponse<ProblemResponse>> getProblemById(
                        @PathVariable Long id) {

                ProblemResponse response = problemService.getProblemById(id);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Problem fetched successfully",
                                                response));
        }

        @PutMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<ProblemResponse>> updateProblem(
                        @PathVariable Long id,
                        @Valid @RequestBody UpdateProblemRequest request) {

                ProblemResponse response = problemService.updateProblem(id, request);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Problem updated successfully",
                                                response));
        }

        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<Void>> deleteProblem(
                        @PathVariable Long id) {

                problemService.deleteProblem(id);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Problem deleted successfully",
                                                null));
        }
}