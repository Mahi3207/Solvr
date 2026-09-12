package com.solvr.backend.controller;

import com.solvr.backend.dto.ApiResponse;
import com.solvr.backend.dto.tag.CreateTagRequest;
import com.solvr.backend.dto.tag.TagResponse;
import com.solvr.backend.dto.tag.UpdateTagRequest;
import com.solvr.backend.service.TagService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {

        private final TagService tagService;

        public TagController(TagService tagService) {
                this.tagService = tagService;
        }

        @PostMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<TagResponse>> createTag(
                        @Valid @RequestBody CreateTagRequest request) {

                TagResponse response = tagService.createTag(request);

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(new ApiResponse<>(
                                                true,
                                                "Tag created successfully",
                                                response));
        }

        @GetMapping
        @PreAuthorize("isAuthenticated()")
        public ResponseEntity<ApiResponse<List<TagResponse>>> getAllTags() {

                List<TagResponse> response = tagService.getAllTags();

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Tags fetched successfully",
                                                response));
        }

        @GetMapping("/{id}")
        @PreAuthorize("isAuthenticated()")
        public ResponseEntity<ApiResponse<TagResponse>> getTagById(
                        @PathVariable Long id) {

                TagResponse response = tagService.getTagById(id);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Tag fetched successfully",
                                                response));
        }

        @PutMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<TagResponse>> updateTag(
                        @PathVariable Long id,
                        @Valid @RequestBody UpdateTagRequest request) {

                TagResponse response = tagService.updateTag(id, request);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Tag updated successfully",
                                                response));
        }

        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<Object>> deleteTag(
                        @PathVariable Long id) {

                tagService.deleteTag(id);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Tag deleted successfully",
                                                null));
        }
}