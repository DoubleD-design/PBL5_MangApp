package com.pbl5.pbl5.controller;

import com.pbl5.pbl5.modal.Manga;
import com.pbl5.pbl5.service.MangaSuggestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suggestions")
public class MangaSuggestionController {
    
    @Autowired
    private MangaSuggestionService mangaSuggestionService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getSuggestedMangas(@PathVariable Integer userId) {
        try {
            List<Manga> suggestions = mangaSuggestionService.getSuggestedMangas(userId);
            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error getting manga suggestions: " + e.getMessage());
        }
    }
}