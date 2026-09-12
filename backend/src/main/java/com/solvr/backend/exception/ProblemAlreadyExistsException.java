package com.solvr.backend.exception;

public class ProblemAlreadyExistsException extends RuntimeException {

    public ProblemAlreadyExistsException(String message) {
        super(message);
    }
}