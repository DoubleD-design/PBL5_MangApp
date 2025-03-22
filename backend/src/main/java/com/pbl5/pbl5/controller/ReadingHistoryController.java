package com.pbl5.pbl5.controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class ReadingHistoryController {
    // Display reading history
    @GetMapping("/display")
    public String displayReadingHistory() {
        // Logic to display reading history
        return "Reading history is displayed.";
    }

    // Add a new reading history
    @PostMapping("/add")
    public String addReadingHistory(@RequestParam Long userId, @RequestParam Long postId) {
        // Logic to add a new reading history
        return "Post with ID " + postId + " has been added to reading history for user with ID " + userId + ".";
    }

    // Remove a reading history
    @DeleteMapping("/remove")
    public String removeReadingHistory(@RequestParam Long userId, @RequestParam Long postId) {
        // Logic to remove a reading history
        return "Post with ID " + postId + " has been removed from reading history for user with ID " + userId + ".";
    }
}
