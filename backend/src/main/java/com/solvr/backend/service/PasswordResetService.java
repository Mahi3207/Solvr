package com.solvr.backend.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.solvr.backend.entity.PasswordResetToken;
import com.solvr.backend.entity.User;
import com.solvr.backend.repository.PasswordResetTokenRepository;

@Service
@Transactional
public class PasswordResetService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public PasswordResetService(
            PasswordResetTokenRepository passwordResetTokenRepository) {

        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    // Create a new reset token
    @Transactional
    public PasswordResetToken createResetToken(User user) {

        passwordResetTokenRepository.deleteByUser(user);
        passwordResetTokenRepository.flush();

        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(LocalDateTime.now().plusMinutes(15));

        return passwordResetTokenRepository.save(token);
    }

    @Transactional
    public void deleteToken(PasswordResetToken token) {
        passwordResetTokenRepository.delete(token);
    }

    // Find token
    public Optional<PasswordResetToken> findByToken(
            String token) {

        return passwordResetTokenRepository.findByToken(token);
    }

    // Verify expiry
    public PasswordResetToken verifyExpiration(
            PasswordResetToken token) {

        if (token.getExpiryDate()
                .isBefore(LocalDateTime.now())) {

            passwordResetTokenRepository.delete(token);

            throw new RuntimeException(
                    "Reset token expired");
        }

        return token;
    }

}