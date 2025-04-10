package com.pbl5.pbl5.service;
import com.pbl5.pbl5.modal.Rating;
import com.pbl5.pbl5.modal.Chapter;
import com.pbl5.pbl5.modal.Manga;
import com.pbl5.pbl5.repos.MangaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MangaService {
    @Autowired
    private MangaRepository mangaRepository;
    
    @Autowired
    private ChapterService chapterService;

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
}
