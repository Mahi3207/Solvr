package com.solvr.backend.dto.problem;

import com.solvr.backend.enums.Difficulty;
import com.solvr.backend.enums.Platform;
import jakarta.validation.constraints.*;

import java.util.Set;

public class CreateProblemRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    private String description;

    @NotNull(message = "Difficulty is required")
    private Difficulty difficulty;

    @NotNull(message = "Platform is required")
    private Platform platform;

    @NotBlank(message = "Problem URL is required")
    @Pattern(regexp = "^(http|https)://.*$", message = "Problem URL must be valid")
    private String problemUrl;

    @NotNull(message = "Estimated time is required")
    @Positive(message = "Estimated time must be greater than 0")
    private Integer estimatedTime;

    @NotNull(message = "Topic is required")
    private Long topicId;

    @NotEmpty(message = "At least one company is required")
    private Set<Long> companyIds;

    @NotEmpty(message = "At least one tag is required")
    private Set<Long> tagIds;

    private Boolean premium = false;

    public CreateProblemRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public Set<Long> getCompanyIds() {
        return companyIds;
    }

    public void setCompanyIds(Set<Long> companyIds) {
        this.companyIds = companyIds;
    }

    public Set<Long> getTagIds() {
        return tagIds;
    }

    public void setTagIds(Set<Long> tagIds) {
        this.tagIds = tagIds;
    }

    public Boolean getPremium() {
        return premium;
    }

    public void setPremium(Boolean premium) {
        this.premium = premium;
    }

}