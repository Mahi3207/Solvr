package com.solvr.backend.dashboard.dto;

public class TopicAnalyticsProjection {

    private final Long topicId;
    private final String topicName;
    private final Long totalProblems;
    private final Long attemptedProblems;
    private final Long solvedProblems;
    private final Double averageMastery;

    public TopicAnalyticsProjection(
            Long topicId,
            String topicName,
            Long totalProblems,
            Long attemptedProblems,
            Long solvedProblems,
            Double averageMastery) {

        this.topicId = topicId;
        this.topicName = topicName;
        this.totalProblems = totalProblems;
        this.attemptedProblems = attemptedProblems;
        this.solvedProblems = solvedProblems;
        this.averageMastery = averageMastery;
    }

    public Long getTopicId() {
        return topicId;
    }

    public String getTopicName() {
        return topicName;
    }

    public Long getTotalProblems() {
        return totalProblems;
    }

    public Long getAttemptedProblems() {
        return attemptedProblems;
    }

    public Long getSolvedProblems() {
        return solvedProblems;
    }

    public Double getAverageMastery() {
        return averageMastery;
    }
}