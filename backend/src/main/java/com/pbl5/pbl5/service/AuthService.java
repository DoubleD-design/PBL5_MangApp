package com.pbl5.pbl5.service;

import com.pbl5.pbl5.config.JwtTokenProvider;
import com.pbl5.pbl5.modal.User;
import com.pbl5.pbl5.repos.UserRepository;
import com.pbl5.pbl5.request.LoginRequest;
import com.pbl5.pbl5.request.RegisterRequest;
import com.pbl5.pbl5.response.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;

    public AuthResponse register(RegisterRequest registerRequest) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new BadCredentialsException("Username already exists");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadCredentialsException("Email already exists");
        }

        // Create new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(User.UserRole.READER); // Default role is READER
        user.setVipStatus(false); // Default VIP status is false
        user.setCreatedAt(LocalDateTime.now());

        // Save user to database
        User savedUser = userRepository.save(user);

        // Generate JWT token
        Authentication authentication = createAuthentication(savedUser);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);

        // Return jwt + user info
        return new AuthResponse(jwt, "Register successful", true, savedUser);
    }

    public AuthResponse login(LoginRequest loginRequest) {
        // Find user by username
        Optional<User> optionalUser = userRepository.findByUsername(loginRequest.getUsername());

        if (optionalUser.isEmpty()) {
            throw new BadCredentialsException("Invalid username");
        }

        User user = optionalUser.get();

        // Verify password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }
        
        // Check if user account is active
        if (user.getActive() != null && !user.getActive()) {
          throw new RuntimeException("Account is locked. Please contact administrator.");
        }

        // Generate JWT token
        Authentication authentication = createAuthentication(user);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);

        // Return jwt + user info
        return new AuthResponse(jwt, "Login successful", true, user);
    }

    public AuthResponse loginWithGoogle(String email, String name, String picture) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user;
        if (optionalUser.isPresent()) {
            user = optionalUser.get();
            // Có thể cập nhật tên/avatar nếu muốn
            user.setUsername(name);
            user.setAvatarUrl(picture);
            userRepository.save(user);
        } else {
            user = new User();
            user.setEmail(email);
            user.setUsername(name);
            user.setAvatarUrl(picture);
            user.setRole(User.UserRole.READER);
            user.setVipStatus(false);
            user.setCreatedAt(LocalDateTime.now());
            user.setPassword(""); // hoặc random chuỗi, hoặc "GOOGLE"
            user.setAbleToComment(true); // Mặc định cho phép bình luận
            user.setActive(true);
            userRepository.save(user);
        }

        Authentication authentication = createAuthentication(user);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);

        return new AuthResponse(jwt, "Login with Google successful", true, user);
    }

    private Authentication createAuthentication(User user) {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

        return new UsernamePasswordAuthenticationToken(user.getEmail(), null, authorities);
    }

    public void verifyPassword(User user, String rawPassword) {
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new BadCredentialsException("Old password is incorrect");
        }
    }

    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    public AuthResponse exchangeGoogleCodeForJwt(String code, String state) {
    // 1. Đổi code lấy access_token
    RestTemplate restTemplate = new RestTemplate();
    String tokenUrl = "https://oauth2.googleapis.com/token";

    
    MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
    params.add("code", code);
    params.add("client_id", googleClientId);
    params.add("client_secret", googleClientSecret);
    params.add("redirect_uri", "http://localhost:8080/oauth2/callback");
    params.add("grant_type", "authorization_code");

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
        Map<String, Object> tokenResponse = restTemplate.postForObject(tokenUrl, request, Map.class);
    System.out.println("Google token response: " + tokenResponse);
    if (tokenResponse == null || tokenResponse.get("access_token") == null) {
        throw new RuntimeException("Failed to get access_token from Google: " + tokenResponse);
    }
    String accessToken = (String) tokenResponse.get("access_token");

    // 2. Lấy user info từ Google
    String userInfoUrl = "https://openidconnect.googleapis.com/v1/userinfo";
    HttpHeaders userInfoHeaders = new HttpHeaders();
    userInfoHeaders.setBearerAuth(accessToken);
    HttpEntity<Void> userInfoRequest = new HttpEntity<>(userInfoHeaders);

    ResponseEntity<Map> userInfoResponse = restTemplate.exchange(
        userInfoUrl, HttpMethod.GET, userInfoRequest, Map.class
    );
    Map<String, Object> userInfo = userInfoResponse.getBody();

    String email = (String) userInfo.get("email");
    String name = (String) userInfo.get("name");
    String picture = (String) userInfo.get("picture");

    // 3. Tìm hoặc tạo user, tạo JWT
    return loginWithGoogle(email, name, picture);
}

}