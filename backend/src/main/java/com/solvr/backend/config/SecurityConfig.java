package com.solvr.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import java.util.List;

import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.solvr.backend.security.JwtAuthenticationFilter;
import org.springframework.security.config.Customizer;
import org.springframework.beans.factory.annotation.Value;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http)
                        throws Exception {

                http
                                .cors(Customizer.withDefaults())
                                .csrf(csrf -> csrf.disable())
                                .formLogin(form -> form.disable())
                                .httpBasic(httpBasic -> httpBasic.disable())

                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(
                                                                "/api/auth/register",
                                                                "/api/auth/login",
                                                                "/api/auth/refresh",
                                                                "/api/auth/logout",
                                                                "/api/auth/forgot-password",
                                                                "/api/auth/reset-password",
                                                                "/api/auth/change-password")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/topics")
                                                .hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/topics/**")
                                                .hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/api/topics/**")
                                                .hasRole("ADMIN")
                                                .requestMatchers("/api/admin/**")
                                                .hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/api/problems**")
                                                .hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/problems/**")
                                                .hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/api/problems/**")
                                                .hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.GET, "/api/problems/**")
                                                .authenticated()
                                                .requestMatchers(HttpMethod.GET, "/api/roadmaps/**")
                                                .hasAnyRole("USER", "ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/api/roadmaps/**")
                                                .hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/roadmaps/**")
                                                .hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/api/roadmaps/**")
                                                .hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.GET,
                                                                "/api/roadmaps/*/problems",
                                                                "/api/roadmap-problems/**")
                                                .hasAnyRole("USER", "ADMIN")

                                                .requestMatchers(HttpMethod.POST,
                                                                "/api/roadmaps/*/problems")
                                                .hasRole("ADMIN")

                                                .requestMatchers(HttpMethod.PUT,
                                                                "/api/roadmap-problems/**")
                                                .hasRole("ADMIN")

                                                .requestMatchers(HttpMethod.DELETE,
                                                                "/api/roadmap-problems/**")
                                                .hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.GET, "/api/search/**")
                                                .hasAnyRole("USER", "ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/api/activity/**")
                                                .hasRole("USER")

                                                .requestMatchers(HttpMethod.GET, "/api/activity/**")
                                                .hasRole("USER")

                                                .requestMatchers(HttpMethod.PUT, "/api/activity/**")
                                                .hasRole("USER")

                                                .requestMatchers(HttpMethod.DELETE, "/api/activity/**")
                                                .hasRole("USER")
                                                .requestMatchers(HttpMethod.POST, "/api/reviews/**")
                                                .hasRole("USER")

                                                .requestMatchers(HttpMethod.GET, "/api/reviews/**")
                                                .hasRole("USER")

                                                .requestMatchers(HttpMethod.DELETE, "/api/reviews/**")
                                                .hasRole("USER")
                                                .anyRequest().authenticated())
                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Value("${app.frontend-url}")
        private String frontendUrl;

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(List.of(frontendUrl));
                configuration.setAllowedMethods(List.of("*"));
                configuration.setAllowedHeaders(List.of("*"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration("/**", configuration);

                return source;
        }

}
