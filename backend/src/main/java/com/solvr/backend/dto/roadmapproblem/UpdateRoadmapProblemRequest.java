package com.solvr.backend.dto.roadmapproblem;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class UpdateRoadmapProblemRequest {

    @NotNull(message = "Display order is required")
    @Positive(message = "Display order must be greater than 0")
    private Integer displayOrder;

    public UpdateRoadmapProblemRequest() {
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

}