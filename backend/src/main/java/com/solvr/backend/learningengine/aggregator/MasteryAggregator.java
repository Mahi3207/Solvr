package com.solvr.backend.learningengine.aggregator;

import org.springframework.stereotype.Component;

/**
 * Combines the four learning dimension scores into a single mastery
 * score in the 0-100 range.
 *
 * This class contains no normalization logic and touches no
 * repositories -- it is a pure combination step over already-computed
 * dimension scores.
 */
@Component
public class MasteryAggregator {

    private static final double UNDERSTANDING_WEIGHT = 0.35;
    private static final double RETENTION_WEIGHT = 0.30;
    private static final double CONFIDENCE_WEIGHT = 0.20;
    private static final double CONSISTENCY_WEIGHT = 0.15;

    private static final double MIN_SCORE = 0.0;
    private static final double MAX_SCORE = 100.0;

    public double aggregate(
            double understandingScore,
            double retentionScore,
            double confidenceScore,
            double consistencyScore) {

        double weightedScore = (understandingScore * UNDERSTANDING_WEIGHT)
                + (retentionScore * RETENTION_WEIGHT)
                + (confidenceScore * CONFIDENCE_WEIGHT)
                + (consistencyScore * CONSISTENCY_WEIGHT);

        return clamp(weightedScore);
    }

    private double clamp(double score) {
        return Math.max(MIN_SCORE, Math.min(MAX_SCORE, score));
    }
}
