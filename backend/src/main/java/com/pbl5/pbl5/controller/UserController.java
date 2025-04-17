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

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

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
        return new ResponseEntity<>(user, HttpStatus.OK);
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

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
    }
}
