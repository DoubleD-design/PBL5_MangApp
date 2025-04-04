package com.pbl5.pbl5.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ratings")
public class RatingController {
    // Display ratings
    @GetMapping("/display")
    public String displayRatings() {
        // Logic to display ratings
        return "Ratings are displayed.";
    }

    // Add a new rating
    @PostMapping("/add")
    public String addRating(@RequestParam Long userId, @RequestParam Long postId, @RequestParam int rating) {
        // Logic to add a new rating
        return "Rating of " + rating + " has been added to post with ID " + postId + " for user with ID " + userId + ".";
    }

    // Update a rating
    @PutMapping("/update")
    public String updateRating(@RequestParam Long userId, @RequestParam Long postId, @RequestParam int rating) {
        // Logic to update a rating
        return "Rating of post with ID " + postId + " for user with ID " + userId + " has been updated to " + rating + ".";
    }

    // Delete a rating
    @DeleteMapping("/delete")
    public String deleteRating(@RequestParam Long userId, @RequestParam Long postId) {
        // Logic to delete a rating
        return "Rating of post with ID " + postId + " for user with ID " + userId + " has been deleted.";
    }
}
