package com.solvr.backend.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.solvr.backend.dto.ApiResponse;

import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

        // Invalid email/password
        @ExceptionHandler(InvalidCredentialsException.class)
        public ResponseEntity<ApiResponse<Object>> handleInvalidCredentials(
                        InvalidCredentialsException ex) {

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(
                                                new ApiResponse<>(
                                                                false,
                                                                ex.getMessage(),
                                                                null));
        }

        // user not found
        @ExceptionHandler(UserNotFoundException.class)
        public ResponseEntity<ApiResponse<Object>> handleUserNotFound(
                        UserNotFoundException ex) {

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(
                                                new ApiResponse<>(
                                                                false,
                                                                ex.getMessage(),
                                                                null));
        }

        // email already exists
        @ExceptionHandler(EmailAlreadyExistsException.class)
        public ResponseEntity<ApiResponse<Object>> handleEmailExists(
                        EmailAlreadyExistsException ex) {

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(
                                                new ApiResponse<>(
                                                                false,
                                                                ex.getMessage(),
                                                                null));
        }

        // DTO validation
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ApiResponse<Object>> handleValidation(
                        MethodArgumentNotValidException ex) {

                Map<String, String> errors = new HashMap<>();

                ex.getBindingResult()
                                .getFieldErrors()
                                .forEach(error -> errors.put(
                                                error.getField(),
                                                error.getDefaultMessage()));

                return ResponseEntity.badRequest()
                                .body(new ApiResponse<>(
                                                false,
                                                "Validation failed",
                                                errors));
        }

        // Validation for request params/path variables
        @ExceptionHandler(ConstraintViolationException.class)
        public ResponseEntity<ApiResponse<Object>> handleConstraintViolation(
                        ConstraintViolationException ex) {

                return ResponseEntity.badRequest()
                                .body(new ApiResponse<>(
                                                false,
                                                ex.getMessage(),
                                                null));
        }

        // Catch-all
        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiResponse<Object>> handleException(
                        Exception ex) {

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ApiResponse<>(
                                                false,
                                                ex.getMessage(),
                                                null));
        }

        @ExceptionHandler(TopicAlreadyExistsException.class)
        public ResponseEntity<ApiResponse<Object>> handleTopicAlreadyExists(
                        TopicAlreadyExistsException ex) {

                return ResponseEntity.badRequest().body(
                                new ApiResponse<>(
                                                false,
                                                ex.getMessage(),
                                                null));
        }

        @ExceptionHandler(TopicNotFoundException.class)
        public ResponseEntity<ApiResponse<Object>> handleTopicNotFound(
                        TopicNotFoundException ex) {

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                                new ApiResponse<>(
                                                false,
                                                ex.getMessage(),
                                                null));
        }

        @ExceptionHandler(CompanyNotFoundException.class)
        public ResponseEntity<ApiResponse<Object>> handleCompanyNotFound(
                        CompanyNotFoundException ex) {

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                                new ApiResponse<>(
                                                false,
                                                ex.getMessage(),
                                                null));
        }

        @ExceptionHandler(CompanyAlreadyExistsException.class)
        public ResponseEntity<ApiResponse<Object>> handleCompanyAlreadyExists(
                        CompanyAlreadyExistsException ex) {

                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                                new ApiResponse<>(
                                                false,
                                                ex.getMessage(),
                                                null));
        }

        @ExceptionHandler(TagAlreadyExistsException.class)
        public ResponseEntity<ApiResponse<Object>> handleTagAlreadyExists(
                        TagAlreadyExistsException ex) {

                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                                new ApiResponse<>(
                                                false,
                                                ex.getMessage(),
                                                null));
        }

        @ExceptionHandler(TagNotFoundException.class)
        public ResponseEntity<ApiResponse<Object>> handleTagNotFound(
                        TagNotFoundException ex) {

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                                new ApiResponse<>(
                                                false,
                                                ex.getMessage(),
                                                null));
        }

        @ExceptionHandler(ProblemAlreadyExistsException.class)
        public ResponseEntity<ApiResponse<Object>> handleProblemAlreadyExists(
                        ProblemAlreadyExistsException ex) {

                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                                new ApiResponse<>(
                                                false,
                                                ex.getMessage(),
                                                null));
        }

        @ExceptionHandler(ProblemNotFoundException.class)
        public ResponseEntity<ApiResponse<Object>> handleProblemNotFound(
                        ProblemNotFoundException ex) {

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                                new ApiResponse<>(
                                                false,
                                                ex.getMessage(),
                                                null));
        }

        @ExceptionHandler(RoadmapAlreadyExistsException.class)
        public ResponseEntity<ApiResponse<String>> handleRoadmapAlreadyExistsException(
                        RoadmapAlreadyExistsException ex) {

                return ResponseEntity.badRequest().body(
                                new ApiResponse<>(
                                                false,
                                                ex.getMessage(),
                                                null));
        }

        @ExceptionHandler(RoadmapNotFoundException.class)
        public ResponseEntity<ApiResponse<String>> handleRoadmapNotFoundException(
                        RoadmapNotFoundException ex) {

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                                new ApiResponse<>(
                                                false,
                                                ex.getMessage(),
                                                null));
        }

        @ExceptionHandler(RoadmapProblemAlreadyExistsException.class)
        public ResponseEntity<ApiResponse<String>> handleRoadmapProblemAlreadyExistsException(
                        RoadmapProblemAlreadyExistsException ex) {

                return ResponseEntity.badRequest().body(
                                new ApiResponse<>(
                                                false,
                                                ex.getMessage(),
                                                null));
        }

        @ExceptionHandler(RoadmapProblemNotFoundException.class)
        public ResponseEntity<ApiResponse<String>> handleRoadmapProblemNotFoundException(
                        RoadmapProblemNotFoundException ex) {

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                                new ApiResponse<>(
                                                false,
                                                ex.getMessage(),
                                                null));
        }

        @ExceptionHandler(UserProblemActivityNotFoundException.class)
        public ResponseEntity<ApiResponse<Object>> handleUserProblemActivityNotFoundException(
                        UserProblemActivityNotFoundException ex) {

                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(new ApiResponse<>(
                                                false,
                                                ex.getMessage(),
                                                null));
        }

        @ExceptionHandler(UserProblemActivityAlreadyExistsException.class)
        public ResponseEntity<ApiResponse<Object>> handleUserProblemActivityAlreadyExistsException(
                        UserProblemActivityAlreadyExistsException ex) {

                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(new ApiResponse<>(
                                                false,
                                                ex.getMessage(),
                                                null));
        }

        @ExceptionHandler(ProblemReviewNotFoundException.class)
        public ResponseEntity<ApiResponse<Object>> handleProblemReviewNotFoundException(
                        ProblemReviewNotFoundException ex) {

                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(new ApiResponse<>(
                                                false,
                                                ex.getMessage(),
                                                null));
        }
}
