package com.solvr.backend.dashboard.dto;

public class TopicAnalyticsResponse {

    private Long topicId;

    private String topicName;

    private Integer totalProblems;

    private Integer attemptedProblems;

    private Integer solvedProblems;

    private Double completionPercentage;

    private Double averageMastery;

    public TopicAnalyticsResponse() {
    }

    public TopicAnalyticsResponse(
            Long topicId,
            String topicName,
            Integer totalProblems,
            Integer attemptedProblems,
            Integer solvedProblems,
            Double completionPercentage,
            Double averageMastery) {

        this.topicId = topicId;
        this.topicName = topicName;
        this.totalProblems = totalProblems;
        this.attemptedProblems = attemptedProblems;
        this.solvedProblems = solvedProblems;
        this.completionPercentage = completionPercentage;
        this.averageMastery = averageMastery;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public Integer getTotalProblems() {
        return totalProblems;
    }

    public void setTotalProblems(Integer totalProblems) {
        this.totalProblems = totalProblems;
    }

    public Integer getAttemptedProblems() {
        return attemptedProblems;
    }

    public void setAttemptedProblems(Integer attemptedProblems) {
        this.attemptedProblems = attemptedProblems;
    }

    public Integer getSolvedProblems() {
        return solvedProblems;
    }

    public void setSolvedProblems(Integer solvedProblems) {
        this.solvedProblems = solvedProblems;
    }

    public Double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public Double getAverageMastery() {
        return averageMastery;
    }

    public void setAverageMastery(Double averageMastery) {
        this.averageMastery = averageMastery;
    }
}