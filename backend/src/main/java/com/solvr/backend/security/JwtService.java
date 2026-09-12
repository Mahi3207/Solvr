package com.solvr.backend.security;

import java.util.Date;

import org.springframework.stereotype.Service;

import com.solvr.backend.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;

@Service
public class JwtService {

        @Value("${jwt.secret}")
        private String secretKey;

        public String generateToken(User user) {

                return Jwts.builder()
                                .setSubject(user.getEmail())
                                .claim("role", user.getRole().name())
                                .setIssuedAt(new Date())
                                .setExpiration(
                                                new Date(System.currentTimeMillis()
                                                                + 1000 * 60 * 60 * 24))
                                .signWith(
                                                SignatureAlgorithm.HS256,
                                                secretKey.getBytes())
                                .compact();
        }

        public String extractRole(String token) {

                Claims claims = Jwts.parser()
                                .setSigningKey(secretKey.getBytes())
                                .build()
                                .parseSignedClaims(token)
                                .getPayload();

                return claims.get("role", String.class);
        }

        public String extractEmail(String token) {

                Claims claims = Jwts.parser()
                                .setSigningKey(secretKey.getBytes())
                                .build()
                                .parseSignedClaims(token)
                                .getPayload();

                return claims.getSubject();
        }
}