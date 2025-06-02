package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.User;
import com.pbl5.pbl5.repos.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(Integer id, User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(userDetails.getUsername());
            user.setEmail(userDetails.getEmail());
            user.setRole(userDetails.getRole());
            return userRepository.save(user);
        }).orElse(null);
    }

    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
    
    public User lockUser(Integer id) {
        return userRepository.findById(id).map(user -> {
            user.setActive(false);
            return userRepository.save(user);
        }).orElse(null);
    }
    
    public User unlockUser(Integer id) {
        return userRepository.findById(id).map(user -> {
            user.setActive(true);
            return userRepository.save(user);
        }).orElse(null);
    }
    
    public User banUser(Integer id) {
        return userRepository.findById(id).map(user -> {
            user.setAbleToComment(false);
            return userRepository.save(user);
        }).orElse(null);
    }
    
    public User unbanUser(Integer id) {
        return userRepository.findById(id).map(user -> {
            user.setAbleToComment(true);
            return userRepository.save(user);
        }).orElse(null);
    }
    
    public User setVipStatus(Integer id, Boolean status) {
        return userRepository.findById(id).map(user -> {
            user.setVipStatus(status);
            return userRepository.save(user);
        }).orElse(null);
    }
    
    /**
     * Updates user's VIP status with start and end dates
     * @param id User ID
     * @param status VIP status
     * @param startDate VIP subscription start date
     * @param endDate VIP subscription end date
     * @return Updated user
     */
    public User updateVipSubscription(Integer id, Boolean status, 
                                     java.time.LocalDateTime startDate, 
                                     java.time.LocalDateTime endDate) {
        return userRepository.findById(id).map(user -> {
            user.setVipStatus(status);
            user.setVipStartDate(startDate);
            user.setVipEndDate(endDate);
            return userRepository.save(user);
        }).orElse(null);
    }
    
    /**
     * Gets all users with active VIP status
     * @return List of VIP users
     */
    public List<User> getAllVipUsers() {
        return userRepository.findByVipStatusTrue();
    }
    
    /**
     * Updates a user entity
     * @param user User entity to update
     * @return Updated user
     */
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    // public Optional<User> findByEmail(String username) {
    //     return userRepository.findByUsername(username);
    // }
}
