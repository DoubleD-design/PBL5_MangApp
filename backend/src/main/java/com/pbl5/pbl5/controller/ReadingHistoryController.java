package com.pbl5.pbl5.controller;

import com.pbl5.pbl5.modal.ReadingHistory;
import com.pbl5.pbl5.service.ReadingHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reading-history")
@CrossOrigin(origins = "*")
public class ReadingHistoryController {
    @Autowired
    private ReadingHistoryService readingHistoryService;
    
    // Get all reading histories
    @GetMapping
    public ResponseEntity<List<ReadingHistory>> getAllReadingHistories() {
        return ResponseEntity.ok(readingHistoryService.getAllReadingHistories());
    }
    
    // Get reading history by ID
    @GetMapping("/{id}")
    public ResponseEntity<ReadingHistory> getReadingHistoryById(@PathVariable Integer id) {
        return readingHistoryService.getReadingHistoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Get reading histories by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReadingHistory>> getReadingHistoriesByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(readingHistoryService.getReadingHistoriesByUserId(userId));
    }
    
    // Get reading histories by manga ID
    @GetMapping("/manga/{mangaId}")
    public ResponseEntity<List<ReadingHistory>> getReadingHistoriesByMangaId(@PathVariable Integer mangaId) {
        return ResponseEntity.ok(readingHistoryService.getReadingHistoriesByMangaId(mangaId));
    }
    
    // Get reading histories by user ID and manga ID
    @GetMapping("/user/{userId}/manga/{mangaId}")
    public ResponseEntity<List<ReadingHistory>> getReadingHistoriesByUserIdAndMangaId(
            @PathVariable Integer userId, 
            @PathVariable Integer mangaId) {
        return ResponseEntity.ok(readingHistoryService.getReadingHistoriesByUserIdAndMangaId(userId, mangaId));
    }
    
    // Create or update reading history
    @PostMapping
    public ResponseEntity<ReadingHistory> createOrUpdateReadingHistory(@RequestBody Map<String, Integer> payload) {
        Integer userId = payload.get("userId");
        Integer mangaId = payload.get("mangaId");
        Integer chapterId = payload.get("chapterId");
        Integer lastReadPage = payload.get("lastReadPage");
        
        if (userId == null || mangaId == null || chapterId == null) {
            return ResponseEntity.badRequest().build();
        }
        
        ReadingHistory readingHistory = readingHistoryService.findOrCreateReadingHistory(userId, mangaId, chapterId);
        if (lastReadPage != null) {
            readingHistory.setLastReadPage(lastReadPage);
            readingHistory = readingHistoryService.createReadingHistory(readingHistory);
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(readingHistory);
    }
    
    // Delete reading history by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReadingHistory(@PathVariable Integer id) {
        readingHistoryService.deleteReadingHistory(id);
        return ResponseEntity.noContent().build();
    }
    
    // Delete all reading histories for a user
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteReadingHistoriesByUserId(@PathVariable Integer userId) {
        readingHistoryService.deleteReadingHistoriesByUserId(userId);
        return ResponseEntity.noContent().build();
    }
}
