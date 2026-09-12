package com.solvr.backend.dto.problemreview;

import com.solvr.backend.enums.MistakeType;
import com.solvr.backend.enums.ProblemStatus;

import java.time.LocalDateTime;

public class ProblemReviewResponse {

    private Long id;

    private Long problemId;

    private String problemTitle;

    private ProblemStatus status;

    private Integer attemptCount;

    private Integer timeSpent;

    private Integer confidenceLevel;

    private Integer difficultyRating;

    private Boolean needRevision;

    private MistakeType mistakeType;

    private String notes;

    private Boolean favoriteAttempt;

    private LocalDateTime reviewDate;

    private LocalDateTime createdAt;

    public ProblemReviewResponse() {
    }

    public ProblemReviewResponse(
            Long id,
            Long problemId,
            String problemTitle,
            ProblemStatus status,
            Integer attemptCount,
            Integer timeSpent,
            Integer confidenceLevel,
            Integer difficultyRating,
            Boolean needRevision,
            MistakeType mistakeType,
            String notes,
            Boolean favoriteAttempt,
            LocalDateTime reviewDate,
            LocalDateTime createdAt) {

        this.id = id;
        this.problemId = problemId;
        this.problemTitle = problemTitle;
        this.status = status;
        this.attemptCount = attemptCount;
        this.timeSpent = timeSpent;
        this.confidenceLevel = confidenceLevel;
        this.difficultyRating = difficultyRating;
        this.needRevision = needRevision;
        this.mistakeType = mistakeType;
        this.notes = notes;
        this.favoriteAttempt = favoriteAttempt;
        this.reviewDate = reviewDate;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(LocalDateTime reviewDate) {
        this.reviewDate = reviewDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}