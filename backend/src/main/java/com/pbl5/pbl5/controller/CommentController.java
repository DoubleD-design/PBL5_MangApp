package com.pbl5.pbl5.controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class CommentController {
    // Display comments
    @GetMapping("/display")
    public String displayComments() {
        // Logic to display comments
        return "Comments are displayed.";
    }

    // Add a new comment
    @PostMapping("/add")
    public String addComment(@RequestParam String commentText) {
        // Logic to add a new comment
        return "Comment " + commentText + " has been added.";
    }

    // Update a comment
    @PutMapping("/update")
    public String updateComment(@RequestParam Long commentId, @RequestParam String newCommentText) {
        // Logic to update a comment
        return "Comment with ID " + commentId + " has been updated to " + newCommentText + ".";
    }

    // Delete a comment
    @DeleteMapping("/delete")
    public String deleteComment(@RequestParam Long commentId) {
        // Logic to delete a comment
        return "Comment with ID " + commentId + " has been deleted.";
    }
}
