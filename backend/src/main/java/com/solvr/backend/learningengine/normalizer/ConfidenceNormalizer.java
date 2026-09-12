package com.solvr.backend.learningengine.normalizer;

import org.springframework.stereotype.Component;

/**
 * Normalizes the raw confidence level (1-5 scale, as stored on
 * UserProblemActivity / ProblemReview) into a 0-100 score.
 */
@Component
public class ConfidenceNormalizer {

    private static final double SCALE_MAX = 5.0;
    private static final double MAX_SCORE = 100.0;

    public double normalize(Integer confidenceLevel) {

        if (confidenceLevel == null || confidenceLevel <= 0) {
            return 0.0;
        }

        double score = (confidenceLevel / SCALE_MAX) * MAX_SCORE;

        return clamp(score);
    }

    private double clamp(double score) {
        return Math.max(0.0, Math.min(MAX_SCORE, score));
    }
}
