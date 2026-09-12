package com.solvr.backend.learningengine.calculator;

import com.solvr.backend.entity.ProblemReview;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Learning Dimension: Consistency.
 *
 * Measures learning stability by looking at the trend of confidence
 * across successive reviews, in chronological order. A user who steadily
 * improves is more consistent than one whose performance fluctuates.
 */
@Component
public class ConsistencyCalculator {

    private static final double NEUTRAL_SCORE = 50.0;
    private static final double TREND_STEP = 10.0;
    private static final int MIN_REVIEWS_FOR_TREND = 2;

    public double calculate(List<ProblemReview> reviews) {

        if (reviews == null || reviews.size() < MIN_REVIEWS_FOR_TREND) {
            return NEUTRAL_SCORE;
        }

        List<ProblemReview> chronological = sortChronologically(reviews);

        int trend = calculateTrend(chronological);

        return clamp(NEUTRAL_SCORE + (trend * TREND_STEP));
    }

    private List<ProblemReview> sortChronologically(List<ProblemReview> reviews) {

        return reviews.stream()
                .sorted(Comparator.comparing(ProblemReview::getReviewDate))
                .collect(Collectors.toList());
    }

    private int calculateTrend(List<ProblemReview> chronological) {

        int improvements = 0;
        int regressions = 0;

        for (int i = 1; i < chronological.size(); i++) {

            int previous = chronological.get(i - 1).getConfidenceLevel();
            int current = chronological.get(i).getConfidenceLevel();

            if (current > previous) {
                improvements++;
            } else if (current < previous) {
                regressions++;
            }
        }

        return improvements - regressions;
    }

    private double clamp(double score) {
        return Math.max(0.0, Math.min(100.0, score));
    }
}
