package com.pbl5.pbl5.controller;
import com.pbl5.pbl5.modal.Rating;
import com.pbl5.pbl5.modal.User;
import com.pbl5.pbl5.repos.UserRepository;
import com.pbl5.pbl5.request.RatingRequest;
import com.pbl5.pbl5.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {    
    @Autowired
    private RatingService ratingService;
    @Autowired
    private UserRepository userRepository;
    
    // Display ratings
    @GetMapping("/display")
    public ResponseEntity<?> displayRatings() {
        return ResponseEntity.ok(ratingService.getAllRatings());
    }

    // Add a new rating
    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addRating(@RequestBody RatingRequest ratingRequest) {
        // Lấy username từ token
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        // Tìm user trong DB
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if rating already exists
        Rating existingRating = ratingService.getRatingRepository().findByUserIdAndMangaId(user.getId(), ratingRequest.getMangaId());
        
        Rating rating;
        if (existingRating != null) {
            // Update existing rating
            existingRating.setRating(ratingRequest.getRating());
            rating = ratingService.createRating(existingRating);
        } else {
            // Create new rating
            rating = new Rating();
            rating.setUserId(user.getId());
            rating.setMangaId(ratingRequest.getMangaId());
            rating.setRating(ratingRequest.getRating());
            rating.setCreatedAt(LocalDateTime.now());
            rating = ratingService.createRating(rating);
        }

        return new ResponseEntity<>(rating, HttpStatus.CREATED);
    }

    // Update a rating
    @PutMapping("/update")
    public ResponseEntity<?> updateRating(@RequestBody Rating ratingRequest) {
        Rating savedRating = ratingService.createRating(ratingRequest);
        return ResponseEntity.ok(savedRating);
    }

    // Delete a rating
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteRating(@PathVariable Integer id) {
        ratingService.deleteRating(id);
        return ResponseEntity.ok().build();
    }
    
    // Get user rating for a specific manga
    @GetMapping("/user-rating")
    public ResponseEntity<?> getUserRating(@RequestParam Integer mangaId) {
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        // Find user in DB
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get rating for current user and manga
        Rating userRating = ratingService.getRatingRepository().findByUserIdAndMangaId(user.getId(), mangaId);
        return ResponseEntity.ok(userRating);
    }
    
    // Get all ratings for a specific manga
    @GetMapping("/manga/{mangaId}")
    public ResponseEntity<?> getMangaRatings(@PathVariable Integer mangaId) {
        List<Rating> mangaRatings = ratingService.getRatingRepository().findByMangaId(mangaId);
        return ResponseEntity.ok(mangaRatings);
    }

    // Get average rating for a manga
    @GetMapping("/manga/{mangaId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Integer mangaId) {
        double averageRating = ratingService.getAverageRatingForManga(mangaId);
        return ResponseEntity.ok(averageRating);
    }
}
