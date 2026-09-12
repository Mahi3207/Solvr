package com.solvr.backend.learningengine.normalizer;

import org.springframework.stereotype.Component;

/**
 * Normalizes time spent against the problem's expected solving time
 * into a 0-100 score.
 *
 * Solving at or under the expected time scores full marks. Score decays
 * as the actual time increasingly exceeds the expected time.
 */
@Component
public class TimeNormalizer {

    private static final double MAX_SCORE = 100.0;
    private static final double MIN_SCORE = 20.0;
    private static final double DECAY_RANGE_RATIO = 2.0;

    public double normalize(Integer timeSpent, Integer estimatedTime) {

        if (timeSpent == null || timeSpent <= 0) {
            return 0.0;
        }

        if (estimatedTime == null || estimatedTime <= 0) {
            return MAX_SCORE;
        }

        double ratio = (double) timeSpent / estimatedTime;

        return clamp(scoreFromRatio(ratio));
    }

    private double scoreFromRatio(double ratio) {

        if (ratio <= 1.0) {
            return MAX_SCORE;
        }

        if (ratio <= DECAY_RANGE_RATIO) {
            double overshoot = ratio - 1.0;
            double decay = overshoot * (MAX_SCORE - MIN_SCORE);
            return MAX_SCORE - decay;
        }

        return MIN_SCORE;
    }

    private double clamp(double score) {
        return Math.max(MIN_SCORE, Math.min(MAX_SCORE, score));
    }
}
