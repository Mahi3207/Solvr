package com.solvr.backend.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.solvr.backend.entity.RefreshToken;
import com.solvr.backend.entity.User;
import com.solvr.backend.repository.RefreshTokenRepository;
import com.solvr.backend.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class RefreshTokenService {

        private final RefreshTokenRepository refreshTokenRepository;
        private final UserRepository userRepository;

        public RefreshTokenService(
                        RefreshTokenRepository refreshTokenRepository,
                        UserRepository userRepository) {

                this.refreshTokenRepository = refreshTokenRepository;
                this.userRepository = userRepository;
        }

        public RefreshToken createRefreshToken(User user) {

                refreshTokenRepository.deleteByUser(user);

                RefreshToken refreshToken = new RefreshToken();

                refreshToken.setUser(user);

                refreshToken.setToken(
                                UUID.randomUUID().toString());

                refreshToken.setExpiryDate(
                                LocalDateTime.now().plusDays(7));

                return refreshTokenRepository.save(
                                refreshToken);
        }

        public RefreshToken verifyExpiration(
                        RefreshToken token) {

                if (token.getExpiryDate()
                                .isBefore(
                                                LocalDateTime.now())) {

                        refreshTokenRepository.delete(
                                        token);

                        throw new RuntimeException(
                                        "Refresh token expired");
                }

                return token;
        }

        public Optional<RefreshToken> findByToken(String token) {

                return refreshTokenRepository
                                .findByToken(token);
        }

        @Transactional
        public void deleteByUser(User user) {
                refreshTokenRepository.deleteByUser(user);
        }
}