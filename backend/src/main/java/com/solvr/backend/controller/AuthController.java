package com.solvr.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import com.solvr.backend.dto.ApiResponse;
import com.solvr.backend.dto.ForgotPasswordRequest;
import com.solvr.backend.dto.LoginRequest;
import com.solvr.backend.dto.LoginResponse;
import com.solvr.backend.dto.RegisterRequest;
import com.solvr.backend.dto.ResetPasswordRequest;
import com.solvr.backend.dto.UserProfileResponse;
import com.solvr.backend.entity.PasswordResetToken;
import com.solvr.backend.entity.RefreshToken;
import com.solvr.backend.entity.User;
import com.solvr.backend.exception.UserNotFoundException;
import com.solvr.backend.repository.UserRepository;
import com.solvr.backend.security.JwtService;
import com.solvr.backend.service.AuthService;
import com.solvr.backend.service.EmailService;
import com.solvr.backend.service.PasswordResetService;
import com.solvr.backend.service.RefreshTokenService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

        @Value("${app.frontend-url}")
        private String frontendUrl;
        private final AuthService authService;
        private final RefreshTokenService refreshTokenService;
        private final JwtService jwtService;
        private final UserRepository userRepository;
        private final PasswordResetService passwordResetService;
        private final EmailService emailService;
        private final PasswordEncoder passwordEncoder;

        public AuthController(AuthService authService,
                        RefreshTokenService refreshTokenService,
                        JwtService jwtService,
                        UserRepository userRepository,
                        PasswordResetService passwordResetService,
                        EmailService emailService,
                        PasswordEncoder passwordEncoder) {
                this.authService = authService;
                this.refreshTokenService = refreshTokenService;
                this.jwtService = jwtService;
                this.userRepository = userRepository;
                this.passwordResetService = passwordResetService;
                this.emailService = emailService;
                this.passwordEncoder = passwordEncoder;
        }

        @PostMapping("/register")
        public ResponseEntity<ApiResponse<UserProfileResponse>> register(
                        @Valid @RequestBody RegisterRequest request) {

                User user = authService.register(request);

                UserProfileResponse userResponse = new UserProfileResponse(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getRole(),
                                user.getCreatedAt());

                ApiResponse<UserProfileResponse> response = new ApiResponse<>(
                                true,
                                "User registered successfully",
                                userResponse);

                return ResponseEntity.ok(response);

        }

        @PostMapping("/login")
        public ResponseEntity<ApiResponse<LoginResponse>> login(
                        @Valid @RequestBody LoginRequest request) {

                LoginResponse loginResponse = authService.login(request);

                ApiResponse<LoginResponse> response = new ApiResponse<>(
                                true,
                                "Login successful",
                                loginResponse);

                return ResponseEntity.ok(response);
        }

        @PostMapping("/refresh")
        public ResponseEntity<?> refreshToken(
                        @RequestParam String refreshToken) {

                RefreshToken token = refreshTokenService
                                .findByToken(refreshToken)
                                .orElseThrow(() -> new RuntimeException(
                                                "Refresh token not found"));

                refreshTokenService.verifyExpiration(
                                token);

                String accessToken = jwtService.generateToken(
                                token.getUser());

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Token refreshed successfully",
                                                Map.of(
                                                                "accessToken",
                                                                accessToken)));
        }

        @PostMapping("/logout")
        public ResponseEntity<ApiResponse<Object>> logout(
                        @RequestParam String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UserNotFoundException("User not found"));

                refreshTokenService.deleteByUser(user);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Logged out successfully",
                                                null));
        }

        @PostMapping("/forgot-password")
        public ResponseEntity<ApiResponse<Object>> forgotPassword(
                        @Valid @RequestBody ForgotPasswordRequest request) {

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new UserNotFoundException("User not found"));

                PasswordResetToken token = passwordResetService.createResetToken(user);

                String resetLink = frontendUrl + "/reset-password?token="
                                + token.getToken();

                emailService.sendEmail(
                                user.getEmail(),
                                "Solvr Password Reset",
                                "<p>Click the button below to reset your password:</p>"
                                                + "<p><a href=\"" + resetLink
                                                + "\">Click here to reset your password</a></p>"
                                                + "<p>This link expires in 15 minutes.</p>");
                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Password reset email sent",
                                                null));
        }

        @PostMapping("/reset-password")
        public ResponseEntity<ApiResponse<Object>> resetPassword(
                        @Valid @RequestBody ResetPasswordRequest request) {

                PasswordResetToken token = passwordResetService.findByToken(request.getToken())
                                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

                passwordResetService.verifyExpiration(token);

                User user = token.getUser();

                user.setPassword(
                                passwordEncoder.encode(
                                                request.getNewPassword()));

                userRepository.save(user);

                passwordResetService.deleteToken(token);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Password reset successful",
                                                null));
        }

        @GetMapping("/me")
        public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(
                        @RequestHeader("Authorization") String authHeader) {

                String token = authHeader.substring(7);

                String email = jwtService.extractEmail(token);

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UserNotFoundException("User not found"));

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
}