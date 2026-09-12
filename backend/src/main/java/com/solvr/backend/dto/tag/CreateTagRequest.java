package com.solvr.backend.dto.tag;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateTagRequest {

    @NotBlank(message = "Tag name is required")
    @Size(max = 100, message = "Tag name cannot exceed 100 characters")
    private String name;

    public CreateTagRequest() {
    }

    public CreateTagRequest(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}