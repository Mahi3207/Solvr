package com.solvr.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.solvr.backend.dto.ApiResponse;
import com.solvr.backend.dto.UserProfileResponse;
import com.solvr.backend.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

        private final AdminService adminService;

        public AdminController(AdminService adminService) {
                this.adminService = adminService;
        }

        @GetMapping("/users")
        public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllUsers() {

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Users fetched successfully",
                                                adminService.getAllUsers()));
        }

        @DeleteMapping("/users/{id}")
        public ResponseEntity<ApiResponse<Object>> deleteUser(
                        @PathVariable Long id) {

                adminService.deleteUser(id);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "User deleted successfully",
                                                null));
        }
}