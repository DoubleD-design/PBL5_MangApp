package com.pbl5.pbl5.service;
import com.pbl5.pbl5.modal.Rating;
import com.pbl5.pbl5.modal.Chapter;
import com.pbl5.pbl5.modal.Manga;
import com.pbl5.pbl5.repos.MangaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MangaService {
    @Autowired
    private MangaRepository mangaRepository;
    
    @Autowired
    //private ChapterService chapterService;

    public List<Manga> getAllMangas() {
        return mangaRepository.findAll();
    }

    public Optional<Manga> getMangaById(Integer id) {
        return mangaRepository.findById(id);
    }

    public Manga createManga(Manga manga) {
        return mangaRepository.save(manga);
    }

    public Manga updateManga(Integer id, Manga mangaDetails) {
        return mangaRepository.findById(id).map(manga -> {
            manga.setTitle(mangaDetails.getTitle());
            manga.setCategories(mangaDetails.getCategories());
            manga.setAuthor(mangaDetails.getAuthor());
            return mangaRepository.save(manga);
        }).orElse(null);
    }

    public void deleteManga(Integer id) {
        mangaRepository.deleteById(id);
    }

    public List<Manga> searchByTitle(String keyword) {
        return mangaRepository.searchByTitle(keyword);
    }
    
    public List<Manga> searchByAuthor(String keyword) {
        return mangaRepository.findByAuthorContainingIgnoreCase(keyword);
    }
    
    public List<Manga> searchByAll(String keyword) {
        // Get results from title search
        List<Manga> titleResults = mangaRepository.searchByTitle(keyword);
        
        // Get results from author search
        List<Manga> authorResults = mangaRepository.findByAuthorContainingIgnoreCase(keyword);
        
        // Combine results (avoiding duplicates)
        java.util.Set<Manga> combinedResults = new java.util.HashSet<>();
        combinedResults.addAll(titleResults);
        combinedResults.addAll(authorResults);
        
        // Add description search (still using stream since we don't have a repository method for this)
        mangaRepository.findAll().stream()
            .filter(manga -> manga.getDescription() != null && 
                    manga.getDescription().toLowerCase().contains(keyword.toLowerCase()))
            .forEach(combinedResults::add);
            
        return new java.util.ArrayList<>(combinedResults);
    }
    
    public List<Manga> getFeaturedMangas() {
        // For now, we'll consider mangas with high ratings as featured
        return mangaRepository.findAll().stream()
            .filter(manga -> !manga.getRatings().isEmpty())
            .sorted((m1, m2) -> {
                double avg1 = m1.getRatings().stream().mapToDouble(Rating::getRating).average().orElse(0.0);
                double avg2 = m2.getRatings().stream().mapToDouble(Rating::getRating).average().orElse(0.0);
                return Double.compare(avg2, avg1);
            })
            .limit(10)
            .toList();
    }
    
    public List<Manga> getLatestUpdates() {
        return mangaRepository.findAll().stream()
            .filter(manga -> !manga.getChapters().isEmpty())
            .sorted((m1, m2) -> {
                LocalDateTime latest1 = m1.getChapters().stream()
                    .map(Chapter::getCreatedAt)
                    .max(LocalDateTime::compareTo)
                    .orElse(LocalDateTime.MIN);
                LocalDateTime latest2 = m2.getChapters().stream()
                    .map(Chapter::getCreatedAt)
                    .max(LocalDateTime::compareTo)
                    .orElse(LocalDateTime.MIN);
                return latest2.compareTo(latest1);
            })
            .toList();
    }
    
    public Manga incrementViews(Integer id) {
        return mangaRepository.findById(id).map(manga -> {
            Integer currentViews = manga.getViews();
            manga.setViews(currentViews == null ? 1 : currentViews + 1);
            return mangaRepository.save(manga);
        }).orElse(null);
    }
    
    public List<Manga> getMostViewedMangas(int limit) {
        return mangaRepository.findAll().stream()
            .sorted((m1, m2) -> {
                Integer views1 = m1.getViews() == null ? 0 : m1.getViews();
                Integer views2 = m2.getViews() == null ? 0 : m2.getViews();
                return views2.compareTo(views1); // Sort in descending order
            })
            .limit(limit)
            .toList();
    }

    public List<Manga> findByCategoriesId(Integer categoryId, Pageable pageable) {
        if (categoryId == null) {
            throw new IllegalArgumentException("Category ID cannot be null");
        }
        return mangaRepository.findByCategoriesId(categoryId, pageable);
    }

}
