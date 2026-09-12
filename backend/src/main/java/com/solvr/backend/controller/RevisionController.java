package com.solvr.backend.controller;

import com.solvr.backend.dto.ApiResponse;
import com.solvr.backend.revisionengine.dto.RevisionResponse;
import com.solvr.backend.revisionengine.service.RevisionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/revision")
public class RevisionController {

        private final RevisionService revisionService;

        public RevisionController(
                        RevisionService revisionService) {

                this.revisionService = revisionService;
        }

        @GetMapping("/today")
        public ResponseEntity<ApiResponse<List<RevisionResponse>>> getTodayRevisions() {

                List<RevisionResponse> response = revisionService.getTodayRevisions();

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Today's revisions retrieved successfully",
                                                response));
        }

        @GetMapping("/overdue")
        public ResponseEntity<ApiResponse<List<RevisionResponse>>> getOverdueRevisions() {

                List<RevisionResponse> response = revisionService.getOverdueRevisions();

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Overdue revisions retrieved successfully",
                                                response));
        }

        @GetMapping("/upcoming")
        public ResponseEntity<ApiResponse<List<RevisionResponse>>> getUpcomingRevisions() {

                List<RevisionResponse> response = revisionService.getUpcomingRevisions();

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Upcoming revisions retrieved successfully",
                                                response));
        }

}