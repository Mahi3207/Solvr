package com.solvr.backend.dto.roadmapproblem;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class AddProblemToRoadmapRequest {

    @NotNull(message = "Problem is required")
    private Long problemId;

    @NotNull(message = "Display order is required")
    @Positive(message = "Display order must be greater than 0")
    private Integer displayOrder;

    public AddProblemToRoadmapRequest() {
    }

    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

}