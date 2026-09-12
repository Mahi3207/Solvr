package com.solvr.backend.dto.userproblemactivity;

import com.solvr.backend.enums.ProblemStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class UpdateUserProblemActivityRequest {

    @NotNull(message = "Problem is required")
    private Long problemId;

    private Long roadmapId;

    @NotNull(message = "Status is required")
    private ProblemStatus status;

    @NotNull(message = "Attempt count is required")
    @PositiveOrZero(message = "Attempt count cannot be negative")
    private Integer attemptCount;

    @NotNull(message = "Time spent is required")
    @PositiveOrZero(message = "Time spent cannot be negative")
    private Integer timeSpent;

    @NotNull(message = "Confidence level is required")
    @Min(value = 1, message = "Confidence level must be between 1 and 5")
    @Max(value = 5, message = "Confidence level must be between 1 and 5")
    private Integer confidenceLevel;

    @NotNull(message = "Difficulty rating is required")
    @Min(value = 1, message = "Difficulty rating must be between 1 and 5")
    @Max(value = 5, message = "Difficulty rating must be between 1 and 5")
    private Integer difficultyRating;

    private String notes;

    private Boolean bookmarked = false;

    private Boolean favourite = false;
    private Boolean needRevision = false;

    public UpdateUserProblemActivityRequest() {
    }

    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public Long getRoadmapId() {
        return roadmapId;
    }

    public void setRoadmapId(Long roadmapId) {
        this.roadmapId = roadmapId;
    }

    public ProblemStatus getStatus() {
        return status;
    }

    public void setStatus(ProblemStatus status) {
        this.status = status;
    }

    public Integer getAttemptCount() {
        return attemptCount;
    }

    public void setAttemptCount(Integer attemptCount) {
        this.attemptCount = attemptCount;
    }

    public Integer getTimeSpent() {
        return timeSpent;
    }

    public void setTimeSpent(Integer timeSpent) {
        this.timeSpent = timeSpent;
    }

    public Integer getConfidenceLevel() {
        return confidenceLevel;
    }

    public void setConfidenceLevel(Integer confidenceLevel) {
        this.confidenceLevel = confidenceLevel;
    }

    public Integer getDifficultyRating() {
        return difficultyRating;
    }

    public void setDifficultyRating(Integer difficultyRating) {
        this.difficultyRating = difficultyRating;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Boolean getBookmarked() {
        return bookmarked;
    }

    public void setBookmarked(Boolean bookmarked) {
        this.bookmarked = bookmarked;
    }

    public Boolean getFavourite() {
        return favourite;
    }

    public void setFavourite(Boolean favourite) {
        this.favourite = favourite;
    }

    public Boolean getNeedRevision() {
        return needRevision;
    }

    public void setNeedRevision(Boolean needRevision) {
        this.needRevision = needRevision;
    }
}