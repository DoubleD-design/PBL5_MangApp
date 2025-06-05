package com.pbl5.pbl5.controller;

import com.pbl5.pbl5.modal.Notification;
import com.pbl5.pbl5.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    // Lấy tất cả notification của user
    @GetMapping("/user/{userId}")
    public List<Notification> getNotificationsByUser(@PathVariable Integer userId) {
        return notificationService.getNotificationsByUserId(userId);
    }

    // (Tuỳ chọn) Lấy tất cả notification (admin)
    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    // (Tuỳ chọn) Xoá notification theo id
    @DeleteMapping("/{notificationId}")
    public void deleteNotification(@PathVariable Integer notificationId) {
        notificationService.deleteNotification(notificationId);
    }

    // Đánh dấu 1 thông báo là đã đọc
    @PutMapping("/{notificationId}/read")
    public void markAsRead(@PathVariable Integer notificationId) {
        notificationService.markAsRead(notificationId);
    }

    // Đánh dấu tất cả thông báo của user là đã đọc
    @PutMapping("/user/{userId}/read-all")
    public void markAllAsRead(@PathVariable Integer userId) {
        notificationService.markAllAsRead(userId);
    }
}
