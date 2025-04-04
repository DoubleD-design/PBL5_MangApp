package com.pbl5.pbl5.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    // Display categories
    @GetMapping("/display")
    public String displayCategories() {
        // Logic to display categories
        return "Categories are displayed.";
    }

    // Add a new category
    @PostMapping("/add")
    public String addCategory(@RequestParam String categoryName) {
        // Logic to add a new category
        return "Category " + categoryName + " has been added.";
    }

    // Update a category
    @PutMapping("/update")
    public String updateCategory(@RequestParam Long categoryId, @RequestParam String newCategoryName) {
        // Logic to update a category
        return "Category with ID " + categoryId + " has been updated to " + newCategoryName + ".";
    }

    // Delete a category
    @DeleteMapping("/delete")
    public String deleteCategory(@RequestParam Long categoryId) {
        // Logic to delete a category
        return "Category with ID " + categoryId + " has been deleted.";
    }
}
