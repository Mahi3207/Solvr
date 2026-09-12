package com.solvr.backend.learningengine.rules;

import com.solvr.backend.entity.UserProblemActivity;

/**
 * A single business rule that can adjust a mastery score based on
 * activity state.
 *
 * New rules are added by implementing this interface and registering
 * an instance in MasteryRuleEngine -- existing rules and calculators
 * never need to change (Open/Closed Principle).
 */
@FunctionalInterface
public interface MasteryRule {

    double apply(UserProblemActivity activity, double currentScore);
}
