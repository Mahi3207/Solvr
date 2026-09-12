package com.solvr.backend.dto.problem;

import com.solvr.backend.enums.Difficulty;
import com.solvr.backend.enums.Platform;

import java.time.LocalDateTime;
import java.util.Set;

public class ProblemResponse {

    private Long id;

    private String title;

    private String slug;

    private String description;

    private Difficulty difficulty;

    private Platform platform;

    private String problemUrl;

    private Integer estimatedTime;

    private Boolean premium;

    private Boolean active;

    private Long topicId;

    private String topicName;

    private Set<String> companies;

    private Set<String> tags;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public ProblemResponse() {
    }

    public ProblemResponse(
            Long id,
            String title,
            String slug,
            String description,
            Difficulty difficulty,
            Platform platform,
            String problemUrl,
            Integer estimatedTime,
            Boolean premium,
            Boolean active,
            Long topicId,
            String topicName,
            Set<String> companies,
            Set<String> tags,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.difficulty = difficulty;
        this.platform = platform;
        this.problemUrl = problemUrl;
        this.estimatedTime = estimatedTime;
        this.premium = premium;
        this.active = active;
        this.topicId = topicId;
        this.topicName = topicName;
        this.companies = companies;
        this.tags = tags;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }

    public Platform getPlatform() {
        return platform;
    }

    public void setPlatform(Platform platform) {
        this.platform = platform;
    }

    public String getProblemUrl() {
        return problemUrl;
    }

    public void setProblemUrl(String problemUrl) {
        this.problemUrl = problemUrl;
    }

    public Integer getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(Integer estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public Boolean getPremium() {
        return premium;
    }

    public void setPremium(Boolean premium) {
        this.premium = premium;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
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

    public Set<String> getCompanies() {
        return companies;
    }

    public void setCompanies(Set<String> companies) {
        this.companies = companies;
    }

    public Set<String> getTags() {
        return tags;
    }

    public void setTags(Set<String> tags) {
        this.tags = tags;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

}