package com.solvr.backend.dto.userproblemactivity;

import com.solvr.backend.enums.ProblemStatus;

import java.time.LocalDateTime;

public class UserProblemActivityResponse {

    private Long id;

    private Long userId;

    private Long problemId;

    private String problemTitle;

    private Long roadmapId;

    private String roadmapTitle;

    private ProblemStatus status;

    private Integer attemptCount;

    private Integer timeSpent;

    private Integer confidenceLevel;

    private Integer difficultyRating;

    private String notes;

    private Boolean bookmarked;

    private Boolean favourite;
    private Boolean needRevision;

    private LocalDateTime solvedAt;

    private LocalDateTime nextRevisionDate;

    private Integer revisionCount;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    private Double masteryScore;
    private LocalDateTime lastMasteryCalculatedAt;

    public UserProblemActivityResponse() {
    }

    public UserProblemActivityResponse(
            Long id,
            Long userId,
            Long problemId,
            String problemTitle,
            Long roadmapId,
            String roadmapTitle,
            ProblemStatus status,
            Integer attemptCount,
            Integer timeSpent,
            Integer confidenceLevel,
            Integer difficultyRating,
            String notes,
            Boolean bookmarked,
            Boolean favourite,
            Boolean needRevision,
            LocalDateTime solvedAt,
            LocalDateTime nextRevisionDate,
            Integer revisionCount,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            Double masteryScore,
            LocalDateTime lastMasteryCalculatedAt) {

        this.id = id;
        this.userId = userId;
        this.problemId = problemId;
        this.problemTitle = problemTitle;
        this.roadmapId = roadmapId;
        this.roadmapTitle = roadmapTitle;
        this.status = status;
        this.attemptCount = attemptCount;
        this.timeSpent = timeSpent;
        this.confidenceLevel = confidenceLevel;
        this.difficultyRating = difficultyRating;
        this.notes = notes;
        this.bookmarked = bookmarked;
        this.favourite = favourite;
        this.needRevision = needRevision;
        this.solvedAt = solvedAt;
        this.nextRevisionDate = nextRevisionDate;
        this.revisionCount = revisionCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.masteryScore = masteryScore;
        this.lastMasteryCalculatedAt = lastMasteryCalculatedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getProblemId() {
        return problemId;
    }

    public String getProblemTitle() {
        return problemTitle;
    }

    public Long getRoadmapId() {
        return roadmapId;
    }

    public String getRoadmapTitle() {
        return roadmapTitle;
    }

    public ProblemStatus getStatus() {
        return status;
    }

    public Integer getAttemptCount() {
        return attemptCount;
    }

    public Integer getTimeSpent() {
        return timeSpent;
    }

    public Integer getConfidenceLevel() {
        return confidenceLevel;
    }

    public Integer getDifficultyRating() {
        return difficultyRating;
    }

    public String getNotes() {
        return notes;
    }

    public Boolean getBookmarked() {
        return bookmarked;
    }

    public Boolean getFavourite() {
        return favourite;
    }

    public Boolean getNeedRevision() {
        return needRevision;
    }

    public LocalDateTime getSolvedAt() {
        return solvedAt;
    }

    public LocalDateTime getNextRevisionDate() {
        return nextRevisionDate;
    }

    public Integer getRevisionCount() {
        return revisionCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public void setProblemTitle(String problemTitle) {
        this.problemTitle = problemTitle;
    }

    public void setRoadmapId(Long roadmapId) {
        this.roadmapId = roadmapId;
    }

    public void setRoadmapTitle(String roadmapTitle) {
        this.roadmapTitle = roadmapTitle;
    }

    public void setStatus(ProblemStatus status) {
        this.status = status;
    }

    public void setAttemptCount(Integer attemptCount) {
        this.attemptCount = attemptCount;
    }

    public void setTimeSpent(Integer timeSpent) {
        this.timeSpent = timeSpent;
    }

    public void setConfidenceLevel(Integer confidenceLevel) {
        this.confidenceLevel = confidenceLevel;
    }

    public void setDifficultyRating(Integer difficultyRating) {
        this.difficultyRating = difficultyRating;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setBookmarked(Boolean bookmarked) {
        this.bookmarked = bookmarked;
    }

    public void setFavourite(Boolean favourite) {
        this.favourite = favourite;
    }

    public void setNeedRevision(Boolean needRevision) {
        this.needRevision = needRevision;
    }

    public void setSolvedAt(LocalDateTime solvedAt) {
        this.solvedAt = solvedAt;
    }

    public void setNextRevisionDate(LocalDateTime nextRevisionDate) {
        this.nextRevisionDate = nextRevisionDate;
    }

    public void setRevisionCount(Integer revisionCount) {
        this.revisionCount = revisionCount;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Double getMasteryScore() {
        return masteryScore;
    }

    public void setMasteryScore(Double masteryScore) {
        this.masteryScore = masteryScore;
    }

    public LocalDateTime getLastMasteryCalculatedAt() {
        return lastMasteryCalculatedAt;
    }

    public void setLastMasteryCalculatedAt(LocalDateTime lastMasteryCalculatedAt) {
        this.lastMasteryCalculatedAt = lastMasteryCalculatedAt;
    }
}