package com.solvr.backend.controller;

import com.solvr.backend.dto.ApiResponse;
import com.solvr.backend.dto.userproblemactivity.CreateUserProblemActivityRequest;
import com.solvr.backend.dto.userproblemactivity.UpdateUserProblemActivityRequest;
import com.solvr.backend.dto.userproblemactivity.UserProblemActivityResponse;
import com.solvr.backend.enums.ProblemStatus;
import com.solvr.backend.service.UserProblemActivityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/activity")
public class UserProblemActivityController {

        private final UserProblemActivityService userProblemActivityService;

        public UserProblemActivityController(
                        UserProblemActivityService userProblemActivityService) {

                this.userProblemActivityService = userProblemActivityService;
        }

        @PostMapping
        public ResponseEntity<ApiResponse<UserProblemActivityResponse>> createActivity(
                        @Valid @RequestBody CreateUserProblemActivityRequest request) {

                UserProblemActivityResponse response = userProblemActivityService.createActivity(request);

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(new ApiResponse<>(
                                                true,
                                                "Activity created successfully",
                                                response));
        }

        @GetMapping
        public ResponseEntity<ApiResponse<List<UserProblemActivityResponse>>> getMyActivities() {

                List<UserProblemActivityResponse> response = userProblemActivityService.getMyActivities();

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Activities retrieved successfully",
                                                response));
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<UserProblemActivityResponse>> getActivityById(
                        @PathVariable Long id) {

                UserProblemActivityResponse response = userProblemActivityService.getActivityById(id);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Activity retrieved successfully",
                                                response));
        }

        @PutMapping("/{id}")
        public ResponseEntity<ApiResponse<UserProblemActivityResponse>> updateActivity(
                        @PathVariable Long id,
                        @Valid @RequestBody UpdateUserProblemActivityRequest request) {

                UserProblemActivityResponse response = userProblemActivityService.updateActivity(id, request);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Activity updated successfully",
                                                response));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteActivity(
                        @PathVariable Long id) {

                userProblemActivityService.deleteActivity(id);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Activity deleted successfully",
                                                null));
        }

        @GetMapping("/status/{status}")
        public ResponseEntity<ApiResponse<List<UserProblemActivityResponse>>> getActivitiesByStatus(
                        @PathVariable ProblemStatus status) {

                List<UserProblemActivityResponse> response = userProblemActivityService.getActivitiesByStatus(status);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Activities retrieved successfully",
                                                response));
        }

        @GetMapping("/bookmarks")
        public ResponseEntity<ApiResponse<List<UserProblemActivityResponse>>> getBookmarkedActivities() {

                List<UserProblemActivityResponse> response = userProblemActivityService.getBookmarkedActivities();

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Bookmarked activities retrieved successfully",
                                                response));
        }

        @GetMapping("/favourites")
        public ResponseEntity<ApiResponse<List<UserProblemActivityResponse>>> getFavouriteActivities() {

                List<UserProblemActivityResponse> response = userProblemActivityService.getFavouriteActivities();

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Favourite activities retrieved successfully",
                                                response));
        }

        @GetMapping("/revision")
        public ResponseEntity<ApiResponse<List<UserProblemActivityResponse>>> getRevisionActivities() {

                List<UserProblemActivityResponse> response = userProblemActivityService.getRevisionActivities();

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Revision activities retrieved successfully",
                                                response));
        }

}