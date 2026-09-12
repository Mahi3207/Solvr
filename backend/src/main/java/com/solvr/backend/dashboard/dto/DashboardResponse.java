package com.solvr.backend.dashboard.dto;

public class DashboardResponse {

    private Integer totalProblems;

    private Integer solvedProblems;

    private Integer attemptedProblems;

    private Integer masteredProblems;

    private Integer notStartedProblems;

    private Double overallProgress;

    private Double overallMastery;

    private Integer revisionDueToday;

    public DashboardResponse() {
    }

    public DashboardResponse(
            Integer totalProblems,
            Integer solvedProblems,
            Integer attemptedProblems,
            Integer masteredProblems,
            Integer notStartedProblems,
            Double overallProgress,
            Double overallMastery,
            Integer revisionDueToday) {

        this.totalProblems = totalProblems;
        this.solvedProblems = solvedProblems;
        this.attemptedProblems = attemptedProblems;
        this.masteredProblems = masteredProblems;
        this.notStartedProblems = notStartedProblems;
        this.overallProgress = overallProgress;
        this.overallMastery = overallMastery;
        this.revisionDueToday = revisionDueToday;

    }

    public Integer getTotalProblems() {
        return totalProblems;
    }

    public void setTotalProblems(Integer totalProblems) {
        this.totalProblems = totalProblems;
    }

    public Integer getSolvedProblems() {
        return solvedProblems;
    }

    public void setSolvedProblems(Integer solvedProblems) {
        this.solvedProblems = solvedProblems;
    }

    public Integer getAttemptedProblems() {
        return attemptedProblems;
    }

    public void setAttemptedProblems(Integer attemptedProblems) {
        this.attemptedProblems = attemptedProblems;
    }

    public Integer getMasteredProblems() {
        return masteredProblems;
    }

    public void setMasteredProblems(Integer masteredProblems) {
        this.masteredProblems = masteredProblems;
    }

    public Integer getNotStartedProblems() {
        return notStartedProblems;
    }

    public void setNotStartedProblems(Integer notStartedProblems) {
        this.notStartedProblems = notStartedProblems;
    }

    public Double getOverallProgress() {
        return overallProgress;
    }

    public void setOverallProgress(Double overallProgress) {
        this.overallProgress = overallProgress;
    }

    public Double getOverallMastery() {
        return overallMastery;
    }

    public void setOverallMastery(Double overallMastery) {
        this.overallMastery = overallMastery;
    }

    public Integer getRevisionDueToday() {
        return revisionDueToday;
    }

    public void setRevisionDueToday(Integer revisionDueToday) {
        this.revisionDueToday = revisionDueToday;
    }

}