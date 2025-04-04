package com.pbl5.pbl5.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chapters")
public class ChapterController {
    // Display chapters
    @GetMapping("/display")
    public String displayChapters() {
        // Logic to display chapters
        return "Chapters are displayed.";
    }

    // Add a new chapter
    @PostMapping("/add")
    public String addChapter(@RequestParam String chapterName) {
        // Logic to add a new chapter
        return "Chapter " + chapterName + " has been added.";
    }

    // Update a chapter
    @PutMapping("/update")
    public String updateChapter(@RequestParam Long chapterId, @RequestParam String newChapterName) {
        // Logic to update a chapter
        return "Chapter with ID " + chapterId + " has been updated to " + newChapterName + ".";
    }

    // Delete a chapter
    @DeleteMapping("/delete")
    public String deleteChapter(@RequestParam Long chapterId) {
        // Logic to delete a chapter
        return "Chapter with ID " + chapterId + " has been deleted.";
    }
}
