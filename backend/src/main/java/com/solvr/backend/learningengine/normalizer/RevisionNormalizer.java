package com.solvr.backend.learningengine.normalizer;

import org.springframework.stereotype.Component;

/**
 * Normalizes revision-related signals (revisionCount, needRevision)
 * into a single 0-100 score.
 *
 * Completed revisions reward the score; an outstanding, unresolved
 * revision requirement penalizes it.
 */
@Component
public class RevisionNormalizer {

    private static final double MAX_SCORE = 100.0;
    private static final double SCORE_PER_REVISION = 20.0;
    private static final double NEED_REVISION_PENALTY = 20.0;

    public double normalize(Integer revisionCount, Boolean needRevision) {

        double score = calculateBaseScore(revisionCount);

        if (Boolean.TRUE.equals(needRevision)) {
            score -= NEED_REVISION_PENALTY;
        }

        return clamp(score);
    }

    private double calculateBaseScore(Integer revisionCount) {

        if (revisionCount == null || revisionCount <= 0) {
            return 0.0;
        }

        return Math.min(revisionCount * SCORE_PER_REVISION, MAX_SCORE);
    }

    private double clamp(double score) {
        return Math.max(0.0, Math.min(MAX_SCORE, score));
    }
}
