package com.solvr.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.solvr.backend.dto.UserProfileResponse;
import com.solvr.backend.entity.User;
import com.solvr.backend.exception.UserNotFoundException;
import com.solvr.backend.repository.PasswordResetTokenRepository;
import com.solvr.backend.repository.RefreshTokenRepository;
import com.solvr.backend.repository.UserRepository;
import com.solvr.backend.repository.UserProblemActivityRepository;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final UserProblemActivityRepository userProblemActivityRepository;

    public AdminService(UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            UserProblemActivityRepository userProblemActivityRepository) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.userProblemActivityRepository = userProblemActivityRepository;
    }

    public List<UserProfileResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new UserProfileResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getCreatedAt()))
                .toList();
    }

    @Transactional
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        refreshTokenRepository.deleteByUser(user);
        passwordResetTokenRepository.deleteByUser(user);

        userProblemActivityRepository.deleteByUser(user);

        userRepository.delete(user);
    }
}
