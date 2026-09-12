package com.solvr.backend.entity;

import com.solvr.backend.enums.MistakeType;
import com.solvr.backend.enums.ProblemStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "problem_reviews")
public class ProblemReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_problem_activity_id", nullable = false)
    private UserProblemActivity userProblemActivity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProblemStatus status;

    @Column(nullable = false)
    private Integer attemptCount;

    @Column(nullable = false)
    private Integer timeSpent;

    @Column(nullable = false)
    private Integer confidenceLevel;

    @Column(nullable = false)
    private Integer difficultyRating;

    @Column(nullable = false)
    private Boolean needRevision = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MistakeType mistakeType;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false)
    private Boolean favoriteAttempt = false;

    @Column(nullable = false)
    private LocalDateTime reviewDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public ProblemReview() {
    }

    @PrePersist
    public void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        this.reviewDate = now;
        this.createdAt = now;
    }

    public Long getId() {
        return id;
    }

    public UserProblemActivity getUserProblemActivity() {
        return userProblemActivity;
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

    public Boolean getNeedRevision() {
        return needRevision;
    }

    public MistakeType getMistakeType() {
        return mistakeType;
    }

    public String getNotes() {
        return notes;
    }

    public Boolean getFavoriteAttempt() {
        return favoriteAttempt;
    }

    public LocalDateTime getReviewDate() {
        return reviewDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserProblemActivity(UserProblemActivity userProblemActivity) {
        this.userProblemActivity = userProblemActivity;
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

    public void setNeedRevision(Boolean needRevision) {
        this.needRevision = needRevision;
    }

    public void setMistakeType(MistakeType mistakeType) {
        this.mistakeType = mistakeType;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setFavoriteAttempt(Boolean favoriteAttempt) {
        this.favoriteAttempt = favoriteAttempt;
    }

    public void setReviewDate(LocalDateTime reviewDate) {
        this.reviewDate = reviewDate;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}