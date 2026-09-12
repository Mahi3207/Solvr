package com.solvr.backend.exception;

public class RoadmapNotFoundException extends RuntimeException {

    public RoadmapNotFoundException(String message) {
        super(message);
    }
}