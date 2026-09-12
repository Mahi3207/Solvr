package com.solvr.backend.exception;

public class TopicAlreadyExistsException extends RuntimeException {

    public TopicAlreadyExistsException(String message) {
        super(message);
    }
}
