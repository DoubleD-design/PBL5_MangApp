package com.pbl5.pbl5.controller;

import com.pbl5.pbl5.modal.*;
import com.pbl5.pbl5.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.pbl5.pbl5.request.UserProfileRequest;
import com.pbl5.pbl5.request.ChangePasswordRequest;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @Autowired
    private AzureBlobService azureBlobService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        return ResponseEntity.of(userService.getUserById(id));
    }

    @GetMapping("/details")
    public ResponseEntity<User> getUserDetails() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.ok(null);
        }
        String email = auth.getName();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Ensure the avatarUrl field is included in the response
        return ResponseEntity.ok(user); 
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @PutMapping("/changeinfo")
    public ResponseEntity<User> updateUserInfo(@RequestBody UserProfileRequest updatedUserRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(updatedUserRequest.getUsername());
        user.setEmail(updatedUserRequest.getEmail());
        user.setBirthday(updatedUserRequest.getBirthday());
        user.setGender(updatedUserRequest.getGender());

        User updatedUser = userService.saveUser(user);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/changepassword")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify old password using AuthService
        authService.verifyPassword(user, request.getOldPassword());

        // Validate new password
        if (request.getPassword() == null || request.getPassword().isEmpty()) { // Use request.getPassword()
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New password cannot be null or empty");
        }

        // Update to new password
        user.setPassword(authService.encodePassword(request.getPassword())); // Use request.getPassword()
        userService.saveUser(user);

        return ResponseEntity.ok("Password changed successfully");
    }
    
    // Check if user has VIP status
    @GetMapping("/vip-status")
    public ResponseEntity<Map<String, Object>> checkVipStatus() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        // If user is not authenticated, they are not VIP
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            Map<String, Object> response = Map.of("isVIP", false);
            return ResponseEntity.ok(response);
        }
        
        String email = auth.getName();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if user has VIP status
        // In a real implementation, this would check a subscription field or membership level
        // For now, we'll assume no users are VIP so ads will show to everyone
        boolean isVIP = Boolean.TRUE.equals(user.getVipStatus());; // This should be replaced with actual logic in production
        
        Map<String, Object> response = Map.of("isVIP", isVIP);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/avatar")
    public ResponseEntity<String> updateAvatar(@RequestPart("file") MultipartFile file) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            // 1. Xoá avatar cũ nếu tồn tại
            if (user.getAvatarUrl() != null) {
                String oldBlobName = azureBlobService.extractBlobNameFromUrl(user.getAvatarUrl());
                azureBlobService.deleteBlob("user", oldBlobName);
            }

            // 2. Upload avatar mới
            String avatarUrl = azureBlobService.uploadAvatarImage(user.getId().toString(), file);

            // 3. Cập nhật URL
            user.setAvatarUrl(avatarUrl);
            userService.saveUser(user);

            return ResponseEntity.ok(avatarUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update avatar: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
    }

    @PostMapping("/{id}/lock")
    public ResponseEntity<User> lockUser(@PathVariable Integer id) {
        User user = userService.lockUser(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/unlock")
    public ResponseEntity<User> unlockUser(@PathVariable Integer id) {
        User user = userService.unlockUser(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/ban")
    public ResponseEntity<User> banUser(@PathVariable Integer id) {
        User user = userService.banUser(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/unban")
    public ResponseEntity<User> unbanUser(@PathVariable Integer id) {
        User user = userService.unbanUser(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/vip")
    public ResponseEntity<User> setVipStatus(@PathVariable Integer id, @RequestBody Map<String, Boolean> payload) {
        Boolean status = payload.get("status");
        User user = userService.setVipStatus(id, status);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
}
