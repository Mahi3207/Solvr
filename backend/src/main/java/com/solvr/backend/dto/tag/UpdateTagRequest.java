package com.solvr.backend.dto.tag;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateTagRequest {

    @NotBlank(message = "Tag name is required")
    @Size(max = 100, message = "Tag name cannot exceed 100 characters")
    private String name;

    private Boolean active;

    public UpdateTagRequest() {
    }

    public UpdateTagRequest(String name, Boolean active) {
        this.name = name;
        this.active = active;
    }

    public String getName() {
        return name;
    }

    public Boolean getActive() {
        return active;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
