package com.solvr.backend.learningengine.calculator;

import com.solvr.backend.entity.ProblemReview;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Learning Dimension: Retention.
 *
 * Measures long-term memory using the normalized revision signal,
 * the quality of past review attempts, and how consistently the user
 * has spaced out their revisions over time.
 *
 * Review history and spacing are derived here directly from the raw
 * ProblemReview list, since they are retention-specific concerns that
 * belong to no other dimension.
 */
@Component
public class RetentionCalculator {

    private static final double REVISION_WEIGHT = 0.40;
    private static final double REVIEW_QUALITY_WEIGHT = 0.35;
    private static final double SPACING_WEIGHT = 0.25;

    private static final double NEUTRAL_SCORE = 50.0;
    private static final double CONFIDENCE_SCALE = 5.0;
    private static final double SPACING_SCORE_PER_REVIEW = 15.0;

    public double calculate(double revisionScore, List<ProblemReview> reviews) {

        double reviewQualityScore = calculateReviewQualityScore(reviews);
        double spacingScore = calculateSpacingScore(reviews);

        double weighted = (revisionScore * REVISION_WEIGHT)
                + (reviewQualityScore * REVIEW_QUALITY_WEIGHT)
                + (spacingScore * SPACING_WEIGHT);

        return clamp(weighted);
    }

    private double calculateReviewQualityScore(List<ProblemReview> reviews) {

        if (reviews == null || reviews.isEmpty()) {
            return NEUTRAL_SCORE;
        }

        double averageConfidence = reviews.stream()
                .mapToInt(ProblemReview::getConfidenceLevel)
                .average()
                .orElse(0);

        return clamp((averageConfidence / CONFIDENCE_SCALE) * 100.0);
    }

    private double calculateSpacingScore(List<ProblemReview> reviews) {

        if (reviews == null || reviews.isEmpty()) {
            return 0.0;
        }

        return clamp(reviews.size() * SPACING_SCORE_PER_REVIEW);
    }

    private double clamp(double score) {
        return Math.max(0.0, Math.min(100.0, score));
    }
}
