package com.solvr.backend.dto.problemreview;

import com.solvr.backend.enums.MistakeType;
import com.solvr.backend.enums.ProblemStatus;
import jakarta.validation.constraints.*;

public class CreateProblemReviewRequest {

    @NotNull(message = "Problem is required")
    private Long problemId;

    @NotNull(message = "Status is required")
    private ProblemStatus status;

    @NotNull(message = "Attempt count is required")
    @Positive(message = "Attempt count must be greater than 0")
    private Integer attemptCount;

    @NotNull(message = "Time spent is required")
    @Positive(message = "Time spent must be greater than 0")
    private Integer timeSpent;

    @NotNull(message = "Confidence level is required")
    @Min(1)
    @Max(5)
    private Integer confidenceLevel;

    @NotNull(message = "Difficulty rating is required")
    @Min(1)
    @Max(5)
    private Integer difficultyRating;

    @NotNull(message = "Need revision is required")
    private Boolean needRevision;

    @NotNull(message = "Mistake type is required")
    private MistakeType mistakeType;

    private String notes;

    private Boolean favoriteAttempt = false;

    public CreateProblemReviewRequest() {
    }

    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
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

    public Boolean getNeedRevision() {
        return needRevision;
    }

    public void setNeedRevision(Boolean needRevision) {
        this.needRevision = needRevision;
    }

    public MistakeType getMistakeType() {
        return mistakeType;
    }

    public void setMistakeType(MistakeType mistakeType) {
        this.mistakeType = mistakeType;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Boolean getFavoriteAttempt() {
        return favoriteAttempt;
    }

    public void setFavoriteAttempt(Boolean favoriteAttempt) {
        this.favoriteAttempt = favoriteAttempt;
    }

}
