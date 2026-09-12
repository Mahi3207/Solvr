package com.solvr.backend.exception;

public class RoadmapAlreadyExistsException extends RuntimeException {

    public RoadmapAlreadyExistsException(String message) {
        super(message);
    }
}