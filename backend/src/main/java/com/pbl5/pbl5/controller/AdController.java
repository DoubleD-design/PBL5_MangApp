package com.pbl5.pbl5.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/ads")
public class AdController {
    // Display advertisements
    @GetMapping("/display")
    public String displayAds() {
        // Logic to display ads
        return "Advertisements are displayed.";
    }

    // Disable advertisements
    @PostMapping("/disable")
    public String disableAds(@RequestParam Long adId) {
        // Logic to disable a specific ad by ID
        return "Advertisement with ID " + adId + " has been disabled.";
    }

    // Block advertisements
    @PostMapping("/block")
    public String blockAds(@RequestParam Long adId) {
        // Logic to block a specific ad by ID
        return "Advertisement with ID " + adId + " has been blocked.";
    }
}
