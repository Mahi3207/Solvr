package com.solvr.backend.dto.roadmapproblem;

import java.time.LocalDateTime;

public class RoadmapProblemResponse {

    private Long id;

    private Long roadmapId;

    private String roadmapTitle;

    private Long problemId;

    private String problemTitle;

    private Integer displayOrder;

    private LocalDateTime createdAt;

    public RoadmapProblemResponse() {
    }

    public RoadmapProblemResponse(
            Long id,
            Long roadmapId,
            String roadmapTitle,
            Long problemId,
            String problemTitle,
            Integer displayOrder,
            LocalDateTime createdAt) {
        this.id = id;
        this.roadmapId = roadmapId;
        this.roadmapTitle = roadmapTitle;
        this.problemId = problemId;
        this.problemTitle = problemTitle;
        this.displayOrder = displayOrder;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoadmapId() {
        return roadmapId;
    }

    public void setRoadmapId(Long roadmapId) {
        this.roadmapId = roadmapId;
    }

    public String getRoadmapTitle() {
        return roadmapTitle;
    }

    public void setRoadmapTitle(String roadmapTitle) {
        this.roadmapTitle = roadmapTitle;
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

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}