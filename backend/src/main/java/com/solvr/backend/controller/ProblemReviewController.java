package com.solvr.backend.controller;

import com.solvr.backend.dto.ApiResponse;
import com.solvr.backend.dto.problemreview.CreateProblemReviewRequest;
import com.solvr.backend.dto.problemreview.ProblemReviewResponse;
import com.solvr.backend.service.ProblemReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ProblemReviewController {

        private final ProblemReviewService problemReviewService;

        public ProblemReviewController(
                        ProblemReviewService problemReviewService) {

                this.problemReviewService = problemReviewService;
        }

        @PostMapping
        public ResponseEntity<ApiResponse<ProblemReviewResponse>> createReview(
                        @Valid @RequestBody CreateProblemReviewRequest request) {

                ProblemReviewResponse response = problemReviewService.createReview(request);

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(new ApiResponse<>(
                                                true,
                                                "Review created successfully",
                                                response));
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<ProblemReviewResponse>> getReviewById(
                        @PathVariable Long id) {

                ProblemReviewResponse response = problemReviewService.getReviewById(id);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Review retrieved successfully",
                                                response));
        }

        @GetMapping("/problem/{problemId}")
        public ResponseEntity<ApiResponse<List<ProblemReviewResponse>>> getReviewsByProblem(
                        @PathVariable Long problemId) {

                List<ProblemReviewResponse> response = problemReviewService.getReviewsByProblem(problemId);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Reviews retrieved successfully",
                                                response));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteReview(
                        @PathVariable Long id) {

                problemReviewService.deleteReview(id);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Review deleted successfully",
                                                null));
        }

}
