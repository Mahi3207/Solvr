package com.solvr.backend.learningengine.normalizer;

import org.springframework.stereotype.Component;

/**
 * Normalizes the raw attempt count signal into a 0-100 score.
 *
 * Fewer attempts to reach the current state implies stronger initial
 * understanding, so the score decays as attempts increase.
 */
@Component
public class AttemptNormalizer {

    private static final double MAX_SCORE = 100.0;
    private static final double MIN_SCORE = 10.0;
    private static final double PENALTY_PER_ATTEMPT = 15.0;

    public double normalize(Integer attemptCount) {

        if (attemptCount == null || attemptCount <= 0) {
            return 0.0;
        }

        double score = MAX_SCORE - ((attemptCount - 1) * PENALTY_PER_ATTEMPT);

        return clamp(score);
    }

    private double clamp(double score) {
        return Math.max(MIN_SCORE, Math.min(MAX_SCORE, score));
    }
}
