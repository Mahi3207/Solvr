package com.solvr.backend.learningengine.rules;

import com.solvr.backend.entity.UserProblemActivity;
import com.solvr.backend.enums.ProblemStatus;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Applies business rules to a calculated mastery score, independently
 * from the calculators that produced it.
 *
 * Rules are held as an ordered list of MasteryRule instances. Adding a
 * new rule in the future means adding one line to buildRules() -- no
 * existing rule or calculator needs to be touched.
 */
@Component
public class MasteryRuleEngine {

    private static final double MIN_SCORE = 0.0;
    private static final double MAX_SCORE = 100.0;
    private static final double NEED_REVISION_CAP = 70.0;
    private static final double SOLVED_MIN_FLOOR = 30.0;

    private final List<MasteryRule> rules;

    public MasteryRuleEngine() {
        this.rules = buildRules();
    }

    public double applyRules(UserProblemActivity activity, double calculatedScore) {

        double score = calculatedScore;

        for (MasteryRule rule : rules) {
            score = rule.apply(activity, score);
        }

        return clamp(score);
    }

    // --------------------------------------------------
    // RULE REGISTRATION
    // --------------------------------------------------

    private List<MasteryRule> buildRules() {

        List<MasteryRule> ruleList = new ArrayList<>();

        ruleList.add(this::applyNotStartedRule);
        ruleList.add(this::applyNeedRevisionRule);
        ruleList.add(this::applySolvedFloorRule);

        return Collections.unmodifiableList(ruleList);
    }

    // --------------------------------------------------
    // RULE DEFINITIONS
    // --------------------------------------------------

    private double applyNotStartedRule(UserProblemActivity activity, double score) {

        if (activity.getStatus() == ProblemStatus.NOT_STARTED) {
            return 0.0;
        }

        return score;
    }

    private double applyNeedRevisionRule(UserProblemActivity activity, double score) {

        if (Boolean.TRUE.equals(activity.getNeedRevision())) {
            return Math.min(score, NEED_REVISION_CAP);
        }

        return score;
    }

    private double applySolvedFloorRule(UserProblemActivity activity, double score) {

        boolean solvedOrBeyond = activity.getStatus() == ProblemStatus.SOLVED
                || activity.getStatus() == ProblemStatus.MASTERED;

        if (solvedOrBeyond) {
            return Math.max(score, SOLVED_MIN_FLOOR);
        }

        return score;
    }

    private double clamp(double score) {
        return Math.max(MIN_SCORE, Math.min(MAX_SCORE, score));
    }
}
