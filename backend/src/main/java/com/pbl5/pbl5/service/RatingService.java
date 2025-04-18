package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.Rating;
import com.pbl5.pbl5.repos.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RatingService {
    @Autowired
    private RatingRepository ratingRepository;

    public List<Rating> getAllRatings() {
        return ratingRepository.findAll();
    }

    public Optional<Rating> getRatingById(Integer id) {
        return ratingRepository.findById(id);
    }

    public Rating createRating(Rating rating) {
        return ratingRepository.save(rating);
    }

    public void deleteRating(Integer id) {
        ratingRepository.deleteById(id);
    }
    
    public RatingRepository getRatingRepository() {
        return ratingRepository;
    }
    
    public double getAverageRatingForManga(Integer mangaId) {
        List<Rating> ratings = ratingRepository.findByMangaId(mangaId);
        if (ratings.isEmpty()) {
            return 0.0;
        }
        double sum = ratings.stream()
                .mapToDouble(Rating::getRating)
                .sum();
        return sum / ratings.size();
    }
}
