package com.pbl5.pbl5.controller;

import com.pbl5.pbl5.request.LoginRequest;
import com.pbl5.pbl5.request.RegisterRequest;
import com.pbl5.pbl5.response.AuthResponse;
import com.pbl5.pbl5.service.AuthService;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    
    @RestController
    public class OAuth2CallbackController {

    @GetMapping("/oauth2/callback")
        public void oauth2Callback(
                @RequestParam("code") String code,
                @RequestParam(value = "state", required = false) String state,
                HttpServletResponse response) throws IOException {
            // Sau khi nhận code, bạn có thể redirect về frontend kèm code và state
            String redirectUrl = "http://localhost:5173/oauth2/callback?code=" + code;
            if (state != null) {
                redirectUrl += "&state=" + state;
            }
            response.sendRedirect(redirectUrl);
        }
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
    @PostMapping("/oauth2/callback")
    public ResponseEntity<AuthResponse> oauth2Callback(@RequestBody Map<String, String> payload) {
        String code = payload.get("code");
        String state = payload.get("state");
        AuthResponse authResponse = authService.exchangeGoogleCodeForJwt(code, state);
        return ResponseEntity.ok(authResponse);
    }
}
