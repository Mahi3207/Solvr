package com.solvr.backend.learningengine.normalizer;

import com.solvr.backend.enums.ProblemStatus;
import org.springframework.stereotype.Component;

/**
 * Normalizes the ProblemStatus signal into a 0-100 score representing
 * how far along the learning journey the user is for a problem.
 */
@Component
public class StatusNormalizer {

    private static final double NOT_STARTED_SCORE = 0.0;
    private static final double IN_PROGRESS_SCORE = 40.0;
    private static final double SOLVED_SCORE = 75.0;
    private static final double MASTERED_SCORE = 100.0;

    public double normalize(ProblemStatus status) {

        if (status == null) {
            return NOT_STARTED_SCORE;
        }

        switch (status) {
            case NOT_STARTED:
                return NOT_STARTED_SCORE;
            case IN_PROGRESS:
                return IN_PROGRESS_SCORE;
            case SOLVED:
                return SOLVED_SCORE;
            case MASTERED:
                return MASTERED_SCORE;
            default:
                return NOT_STARTED_SCORE;
        }
    }
}
