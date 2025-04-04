package com.pbl5.pbl5.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pages")
public class PageControler {
    // Display page
    @GetMapping("/display")
    public String displayPage() {
        // Logic to display page
        return "Page is displayed.";
    }

    // Create a new page
    @PostMapping("/create")
    public String createPage(@RequestParam Long userId, @RequestParam String title) {
        // Logic to create a new page
        return "Page with title " + title + " has been created for user with ID " + userId + ".";
    }

    // Update a page
    @PutMapping("/update")
    public String updatePage(@RequestParam Long pageId, @RequestParam String title) {
        // Logic to update a page
        return "Page with ID " + pageId + " has been updated with new title: " + title + ".";
    }

    // Delete a page
    @DeleteMapping("/delete")
    public String deletePage(@RequestParam Long pageId) {
        // Logic to delete a page
        return "Page with ID " + pageId + " has been deleted.";
    }
}
