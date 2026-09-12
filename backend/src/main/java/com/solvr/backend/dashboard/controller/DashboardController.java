package com.solvr.backend.dashboard.controller;

import com.solvr.backend.dashboard.dto.DashboardResponse;
import com.solvr.backend.dashboard.service.DashboardService;
import com.solvr.backend.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.solvr.backend.dashboard.dto.TopicAnalyticsResponse;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

        private final DashboardService dashboardService;

        public DashboardController(
                        DashboardService dashboardService) {

                this.dashboardService = dashboardService;
        }

        @GetMapping
        public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {

                DashboardResponse response = dashboardService.getDashboard();

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Dashboard retrieved successfully",
                                                response));
        }

        @GetMapping("/topics")
        public ResponseEntity<ApiResponse<List<TopicAnalyticsResponse>>> getTopicAnalytics() {

                List<TopicAnalyticsResponse> response = dashboardService.getTopicAnalytics();

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Topic analytics retrieved successfully",
                                                response));
        }
}