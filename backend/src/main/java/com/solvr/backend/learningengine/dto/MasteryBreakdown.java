package com.solvr.backend.learningengine.dto;

import java.time.LocalDateTime;

/**
 * Transparent breakdown of a mastery calculation, showing every
 * learning dimension score alongside the final mastery score.
 *
 * Consumed later by the dashboard, analytics, recommendations,
 * weak/strong topics, roadmap progress, and the future AI layer.
 *
 * Deliberately carries no problem/activity display metadata (e.g. title)
 * -- that belongs to the response layer that maps activity + this
 * breakdown together, not to the engine's own output.
 */
public class MasteryBreakdown {

    private Long activityId;
    private Long problemId;

    private double understandingScore;
    private double retentionScore;
    private double confidenceScore;
    private double consistencyScore;

    private double finalMasteryScore;

    private LocalDateTime calculatedAt;

    public MasteryBreakdown() {
    }

    public MasteryBreakdown(
            Long activityId,
            Long problemId,
            double understandingScore,
            double retentionScore,
            double confidenceScore,
            double consistencyScore,
            double finalMasteryScore,
            LocalDateTime calculatedAt) {

        this.activityId = activityId;
        this.problemId = problemId;
        this.understandingScore = understandingScore;
        this.retentionScore = retentionScore;
        this.confidenceScore = confidenceScore;
        this.consistencyScore = consistencyScore;
        this.finalMasteryScore = finalMasteryScore;
        this.calculatedAt = calculatedAt;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public double getUnderstandingScore() {
        return understandingScore;
    }

    public void setUnderstandingScore(double understandingScore) {
        this.understandingScore = understandingScore;
    }

    public double getRetentionScore() {
        return retentionScore;
    }

    public void setRetentionScore(double retentionScore) {
        this.retentionScore = retentionScore;
    }

    public double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public double getConsistencyScore() {
        return consistencyScore;
    }

    public void setConsistencyScore(double consistencyScore) {
        this.consistencyScore = consistencyScore;
    }

    public double getFinalMasteryScore() {
        return finalMasteryScore;
    }

    public void setFinalMasteryScore(double finalMasteryScore) {
        this.finalMasteryScore = finalMasteryScore;
    }

    public LocalDateTime getCalculatedAt() {
        return calculatedAt;
    }

    public void setCalculatedAt(LocalDateTime calculatedAt) {
        this.calculatedAt = calculatedAt;
    }
}
