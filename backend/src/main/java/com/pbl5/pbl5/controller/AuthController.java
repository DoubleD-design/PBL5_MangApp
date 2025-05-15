package com.pbl5.pbl5.controller;

import com.pbl5.pbl5.request.LoginRequest;
import com.pbl5.pbl5.request.RegisterRequest;
import com.pbl5.pbl5.response.AuthResponse;
import com.pbl5.pbl5.service.AuthService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    
    @GetMapping("/loginGoogle")
    public Map<String, Object> loginGoogle(OAuth2AuthenticationToken authentication) {
        // Lấy thông tin người dùng từ Google
        Map<String, Object> attributes = authentication.getPrincipal().getAttributes();

        // Trả về thông tin xác thực
        return attributes;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest) {
        AuthResponse authResponse = authService.register(registerRequest);
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.login(loginRequest);
        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }
}
