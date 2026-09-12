package com.solvr.backend.dto.roadmap;

import com.solvr.backend.enums.RoadmapLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class CreateRoadmapRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    private String description;

    @NotNull(message = "Level is required")
    private RoadmapLevel level;

    @NotNull(message = "Estimated duration is required")
    @Positive(message = "Estimated duration must be greater than 0")
    private Integer estimatedDuration;

    public CreateRoadmapRequest() {
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

}
