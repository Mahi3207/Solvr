package com.solvr.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.solvr.backend.dto.ChangePasswordRequest;
import com.solvr.backend.dto.UpdateProfileRequest;
import com.solvr.backend.entity.User;
import com.solvr.backend.exception.InvalidCredentialsException;
import com.solvr.backend.exception.UserNotFoundException;
import com.solvr.backend.repository.PasswordResetTokenRepository;
import com.solvr.backend.repository.RefreshTokenRepository;
import com.solvr.backend.repository.UserRepository;

@Service
public class UserService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final RefreshTokenRepository refreshTokenRepository;
        private final PasswordResetTokenRepository passwordResetTokenRepository;

        public UserService(UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        RefreshTokenRepository refreshTokenRepository,
                        PasswordResetTokenRepository passwordResetTokenRepository) {
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.refreshTokenRepository = refreshTokenRepository;
                this.passwordResetTokenRepository = passwordResetTokenRepository;
        }

        public User getCurrentUser(String email) {

                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "User not found"));
        }

        public User getUserById(Long id) {

                return userRepository.findById(id)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "User not found"));
        }

        public void deleteUser(Long id) {

                User user = getUserById(id);

                userRepository.delete(user);
        }

        public User updateProfile(
                        String email,
                        UpdateProfileRequest request) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "User not found"));

                user.setName(request.getName());

                return userRepository.save(user);
        }

        public void changePassword(
                        String email,
                        ChangePasswordRequest request) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "User not found"));

                if (!passwordEncoder.matches(
                                request.getCurrentPassword(),
                                user.getPassword())) {

                        throw new InvalidCredentialsException(
                                        "Current password is incorrect");
                }

                user.setPassword(
                                passwordEncoder.encode(
                                                request.getNewPassword()));

                userRepository.save(user);
        }

        @Transactional
        public void deleteCurrentUser(String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UserNotFoundException("User not found"));

                refreshTokenRepository.deleteByUser(user);

                passwordResetTokenRepository.deleteByUser(user);

                userRepository.delete(user);
        }
}
