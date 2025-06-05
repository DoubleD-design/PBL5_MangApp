package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.Notification;
import com.pbl5.pbl5.repos.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Optional<Notification> getNotificationById(Integer id) {
        return notificationRepository.findById(id);
    }

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void deleteNotification(Integer id) {
        notificationRepository.deleteById(id);
    }

    public List<Notification> getNotificationsByUserId(Integer userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(Integer notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }

    public void markAllAsRead(Integer userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsRead(userId, false);
        for (Notification notification : notifications) {
            notification.setIsRead(true);
        }
        notificationRepository.saveAll(notifications);
    }
}
