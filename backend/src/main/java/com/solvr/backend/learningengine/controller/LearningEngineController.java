package com.solvr.backend.learningengine.controller;

import com.solvr.backend.dto.ApiResponse;
import com.solvr.backend.learningengine.dto.MasteryBreakdown;
import com.solvr.backend.learningengine.service.LearningEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Thin controller for the Learning Engine.
 *
 * Contains no formulas, weights, or business rules -- it only delegates
 * to LearningEngineService and wraps the result in ApiResponse<T>.
 */
@RestController
@RequestMapping("/api/learning-engine")
public class LearningEngineController {

    private final LearningEngineService learningEngineService;

    public LearningEngineController(LearningEngineService learningEngineService) {
        this.learningEngineService = learningEngineService;
    }

    @PostMapping("/activities/{activityId}/calculate")
    public ResponseEntity<ApiResponse<MasteryBreakdown>> calculateMastery(
            @PathVariable Long activityId) {

        MasteryBreakdown breakdown = learningEngineService.calculateMastery(activityId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Mastery calculated successfully",
                        breakdown));
    }
}
