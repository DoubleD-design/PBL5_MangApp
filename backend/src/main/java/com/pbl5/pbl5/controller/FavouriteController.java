package com.pbl5.pbl5.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/favourites")
public class FavouriteController {
    // Display favourites
    @GetMapping("/display")
    public String displayFavourites() {
        // Logic to display favourites
        return "Favourites are displayed.";
    }

    // Add a new favourite
    @PostMapping("/add")
    public String addFavourite(@RequestParam Long userId, @RequestParam Long postId) {
        // Logic to add a new favourite
        return "Post with ID " + postId + " has been added to favourites for user with ID " + userId + ".";
    }

    // Remove a favourite
    @DeleteMapping("/remove")
    public String removeFavourite(@RequestParam Long userId, @RequestParam Long postId) {
        // Logic to remove a favourite
        return "Post with ID " + postId + " has been removed from favourites for user with ID " + userId + ".";
    }
}
