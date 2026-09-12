package com.solvr.backend.learningengine.calculator;

import org.springframework.stereotype.Component;

/**
 * Learning Dimension: Understanding.
 *
 * Measures how well the user grasped the problem initially, using
 * problem status, attempt efficiency, and time efficiency.
 *
 * This calculator only consumes already-normalized (0-100) signals.
 * It has no knowledge of raw entity fields, normalization rules, or
 * retention/confidence/consistency concerns.
 */
@Component
public class UnderstandingCalculator {

    private static final double STATUS_WEIGHT = 0.4;
    private static final double ATTEMPT_WEIGHT = 0.3;
    private static final double TIME_WEIGHT = 0.3;

    public double calculate(double statusScore, double attemptScore, double timeScore) {

        double weighted = (statusScore * STATUS_WEIGHT)
                + (attemptScore * ATTEMPT_WEIGHT)
                + (timeScore * TIME_WEIGHT);

        return clamp(weighted);
    }

    private double clamp(double score) {
        return Math.max(0.0, Math.min(100.0, score));
    }
}
