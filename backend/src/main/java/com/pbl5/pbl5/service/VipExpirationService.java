package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.User;
import com.pbl5.pbl5.repos.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VipExpirationService {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Scheduled task that runs daily at midnight to check and update expired VIP subscriptions
     * Sets vipStatus to false for users whose subscription has expired
     */
    @Scheduled(cron = "0 0 0 * * ?") // Run at midnight every day
    public void checkAndUpdateExpiredSubscriptions() {
        LocalDateTime now = LocalDateTime.now();
        
        // Find all users with active VIP status but expired end date
        List<User> expiredVipUsers = userRepository.findByVipStatusTrueAndVipEndDateBefore(now);
        
        // Update VIP status for expired users
        for (User user : expiredVipUsers) {
            user.setVipStatus(false);
            userRepository.save(user);
        }
    }
}