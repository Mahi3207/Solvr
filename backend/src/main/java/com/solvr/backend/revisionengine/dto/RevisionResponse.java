package com.solvr.backend.revisionengine.dto;

import java.time.LocalDateTime;

public class RevisionResponse {

    private Long activityId;

    private Long problemId;

    private String problemTitle;

    private Integer revisionCount;

    private LocalDateTime nextRevisionDate;

    private Boolean needRevision;

    private Double masteryScore;

    public RevisionResponse() {
    }

    public RevisionResponse(
            Long activityId,
            Long problemId,
            String problemTitle,
            Integer revisionCount,
            LocalDateTime nextRevisionDate,
            Boolean needRevision,
            Double masteryScore) {

        this.activityId = activityId;
        this.problemId = problemId;
        this.problemTitle = problemTitle;
        this.revisionCount = revisionCount;
        this.nextRevisionDate = nextRevisionDate;
        this.needRevision = needRevision;
        this.masteryScore = masteryScore;
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

    public String getProblemTitle() {
        return problemTitle;
    }

    public void setProblemTitle(String problemTitle) {
        this.problemTitle = problemTitle;
    }

    public Integer getRevisionCount() {
        return revisionCount;
    }

    public void setRevisionCount(Integer revisionCount) {
        this.revisionCount = revisionCount;
    }

    public LocalDateTime getNextRevisionDate() {
        return nextRevisionDate;
    }

    public void setNextRevisionDate(LocalDateTime nextRevisionDate) {
        this.nextRevisionDate = nextRevisionDate;
    }

    public Boolean getNeedRevision() {
        return needRevision;
    }

    public void setNeedRevision(Boolean needRevision) {
        this.needRevision = needRevision;
    }

    public Double getMasteryScore() {
        return masteryScore;
    }

    public void setMasteryScore(Double masteryScore) {
        this.masteryScore = masteryScore;
    }
}