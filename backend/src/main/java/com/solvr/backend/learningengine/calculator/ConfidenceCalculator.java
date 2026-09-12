package com.solvr.backend.learningengine.calculator;

import org.springframework.stereotype.Component;

/**
 * Learning Dimension: Confidence.
 *
 * Measures confidence calibration -- how closely the user's self-reported
 * confidence matches their actual demonstrated performance (status).
 *
 * A small gap between confidenceScore and statusScore means the user
 * has an accurate sense of their own mastery, which is itself a
 * valuable learning signal distinct from raw understanding.
 */
@Component
public class ConfidenceCalculator {

    private static final double MAX_SCORE = 100.0;

    public double calculate(double confidenceScore, double statusScore) {

        double calibrationGap = Math.abs(confidenceScore - statusScore);

        double calibrationScore = MAX_SCORE - calibrationGap;

        return clamp(calibrationScore);
    }

    private double clamp(double score) {
        return Math.max(0.0, Math.min(MAX_SCORE, score));
    }
}
