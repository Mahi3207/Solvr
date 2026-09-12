package com.solvr.backend.dto.roadmap;

import com.solvr.backend.enums.RoadmapLevel;

import java.time.LocalDateTime;

public class RoadmapResponse {

    private Long id;

    private String title;

    private String description;

    private RoadmapLevel level;

    private Integer estimatedDuration;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public RoadmapResponse() {
    }

    public RoadmapResponse(
            Long id,
            String title,
            String description,
            RoadmapLevel level,
            Integer estimatedDuration,
            Boolean active,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.level = level;
        this.estimatedDuration = estimatedDuration;
        this.active = active;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public RoadmapLevel getLevel() {
        return level;
    }

    public void setLevel(RoadmapLevel level) {
        this.level = level;
    }

    public Integer getEstimatedDuration() {
        return estimatedDuration;
    }

    public void setEstimatedDuration(Integer estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
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