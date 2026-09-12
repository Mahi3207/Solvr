package com.solvr.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.solvr.backend.dto.ApiResponse;
import com.solvr.backend.dto.ChangePasswordRequest;
import com.solvr.backend.dto.UpdateProfileRequest;
import com.solvr.backend.dto.UserProfileResponse;
import com.solvr.backend.entity.User;
import com.solvr.backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

        private final UserService userService;

        public UserController(UserService userService) {
                this.userService = userService;
        }

        // Current Logged-in User
        @GetMapping("/me")
        public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser(
                        Authentication authentication) {

                User user = userService.getCurrentUser(authentication.getName());

                UserProfileResponse response = new UserProfileResponse(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getRole(),
                                user.getCreatedAt());
                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Profile fetched successfully",
                                                response));
        }

        // Get User by ID (admin only - must never leak the password hash)
        @GetMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<UserProfileResponse>> getUserById(
                        @PathVariable Long id) {

                User user = userService.getUserById(id);

                UserProfileResponse response = new UserProfileResponse(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getRole(),
                                user.getCreatedAt());

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "User fetched successfully",
                                                response));
        }

        // Delete User (admin only - use /me to delete your own account)
        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<Object>> deleteUser(
                        @PathVariable Long id) {

                userService.deleteUser(id);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "User deleted successfully",
                                                null));
        }

        @PutMapping("/me")
        public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(

                        Authentication authentication,

                        @Valid @RequestBody UpdateProfileRequest request) {

                User user = userService.updateProfile(
                                authentication.getName(),
                                request);

                UserProfileResponse response = new UserProfileResponse(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getRole(),
                                user.getCreatedAt());

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Profile updated successfully",
                                                response));
        }

        @PutMapping("/change-password")
        public ResponseEntity<ApiResponse<Object>> changePassword(

                        Authentication authentication,

                        @Valid @RequestBody ChangePasswordRequest request) {

                userService.changePassword(
                                authentication.getName(),
                                request);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Password changed successfully",
                                                null));
        }

        @DeleteMapping("/me")
        public ResponseEntity<ApiResponse<Object>> deleteMyAccount(
                        Authentication authentication) {

                userService.deleteCurrentUser(
                                authentication.getName());

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Account deleted successfully",
                                                null));
        }
}