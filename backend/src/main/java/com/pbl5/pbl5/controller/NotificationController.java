package com.pbl5.pbl5.controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class NotificationController {
    // Display notifications
    @GetMapping("/display")
    public String displayNotifications() {
        // Logic to display notifications
        return "Notifications are displayed.";
    }

    // Send a new notification
    @PostMapping("/send")
    public String sendNotification(@RequestParam Long userId, @RequestParam String message) {
        // Logic to send a new notification
        return "Notification with message " + message + " has been sent to user with ID " + userId + ".";
    }

    // Delete a notification
    @DeleteMapping("/delete")
    public String deleteNotification(@RequestParam Long notificationId) {
        // Logic to delete a notification
        return "Notification with ID " + notificationId + " has been deleted.";
    }
}
