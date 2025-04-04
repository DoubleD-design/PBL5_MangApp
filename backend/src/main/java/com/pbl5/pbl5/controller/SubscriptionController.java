package com.pbl5.pbl5.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/subscriptions")
public class SubscriptionController {
    // Display subscriptions
    @GetMapping("/display")
    public String displaySubscriptions() {
        // Logic to display subscriptions
        return "Subscriptions are displayed.";
    }

    // Add a new subscription
    @PostMapping("/add")
    public String addSubscription(@RequestParam Long userId, @RequestParam Long channelId) {
        // Logic to add a new subscription
        return "Channel with ID " + channelId + " has been subscribed by user with ID " + userId + ".";
    }

    // Remove a subscription
    @DeleteMapping("/remove")
    public String removeSubscription(@RequestParam Long userId, @RequestParam Long channelId) {
        // Logic to remove a subscription
        return "Channel with ID " + channelId + " has been unsubscribed by user with ID " + userId + ".";
    }
}
