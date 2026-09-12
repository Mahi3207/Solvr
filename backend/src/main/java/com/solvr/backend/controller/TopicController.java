package com.solvr.backend.controller;

import com.solvr.backend.dto.ApiResponse;
import com.solvr.backend.dto.topic.CreateTopicRequest;
import com.solvr.backend.dto.topic.TopicResponse;
import com.solvr.backend.dto.topic.UpdateTopicRequest;
import com.solvr.backend.service.TopicService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

        private final TopicService topicService;

        public TopicController(TopicService topicService) {
                this.topicService = topicService;
        }

        @PostMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<TopicResponse>> createTopic(
                        @Valid @RequestBody CreateTopicRequest request) {

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Topic created successfully",
                                                topicService.createTopic(request)));
        }

        @GetMapping
        public ResponseEntity<ApiResponse<List<TopicResponse>>> getAllTopics() {

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Topics fetched successfully",
                                                topicService.getAllTopics()));
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<TopicResponse>> getTopicById(
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Topic fetched successfully",
                                                topicService.getTopicById(id)));
        }

        @PutMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<TopicResponse>> updateTopic(
                        @PathVariable Long id,
                        @Valid @RequestBody UpdateTopicRequest request) {

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Topic updated successfully",
                                                topicService.updateTopic(id, request)));
        }

        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<Object>> deleteTopic(
                        @PathVariable Long id) {

                topicService.deleteTopic(id);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Topic deleted successfully",
                                                null));
        }
}
