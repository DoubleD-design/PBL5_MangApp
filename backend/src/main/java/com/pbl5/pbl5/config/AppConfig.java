package com.pbl5.pbl5.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Configuration
public class AppConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .and()
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/manga/**").permitAll()
                        .requestMatchers("/api/categories/**").permitAll()
                        .requestMatchers("/api/chapters/**").permitAll()
                        .requestMatchers("/api/users/details").permitAll()
                        .requestMatchers("/api/comments/manga/**").permitAll()
                        .requestMatchers("/api/ratings/manga/*/average").permitAll()
                        .requestMatchers("/api/ratings/manga/*").permitAll()
                        .requestMatchers("/oauth2/**").permitAll() // Cho phép route của OAuth2
                        .requestMatchers("/api/auth/loginGoogle").permitAll() // OAuth2 login endpoint
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll()
                )
                .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)
                .csrf().disable()
                .cors().configurationSource(new CorsConfigurationSource() {

                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {

                        CorsConfiguration cfg = new CorsConfiguration();

                        cfg.setAllowedOrigins(Arrays.asList(
                                        "http://localhost:5173",
                                        "http://localhost:4000",
                                        "http://localhost:4200",
                                        "https://shopwithzosh.vercel.app",
                                        "https://ecommerce-angular-blue.vercel.app/",
                                        "http://localhost:8080"
                                )
                        );
                        cfg.setAllowedMethods(Collections.singletonList("*"));
                        cfg.setAllowCredentials(true);
                        cfg.setAllowedHeaders(Collections.singletonList("*"));
                        cfg.setExposedHeaders(List.of("Authorization"));
                        cfg.setMaxAge(3600L);
                        return cfg;

                    }
                })
                .and()
                .oauth2Login() // Kích hoạt OAuth2 Login
                .and()
                .oauth2Login(oauth -> oauth
                    .authorizationEndpoint(authorization -> authorization
                        .baseUri("/oauth2/authorization")
                    )
                    .redirectionEndpoint(redirection -> redirection
                        .baseUri("/oauth2/callback/*")
                    )
                )
                .httpBasic();

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}