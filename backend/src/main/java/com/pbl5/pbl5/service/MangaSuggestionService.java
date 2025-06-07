package com.pbl5.pbl5.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pbl5.pbl5.modal.Category;
import com.pbl5.pbl5.modal.Manga;
import com.pbl5.pbl5.modal.ReadingHistory;
import com.pbl5.pbl5.repos.MangaRepository;
import com.pbl5.pbl5.repos.ReadingHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MangaSuggestionService {
    
    @Autowired
    private GeminiService geminiService;
    
    @Autowired
    private MangaRepository mangaRepository;
    
    @Autowired
    private ReadingHistoryRepository readingHistoryRepository;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public List<Manga> getSuggestedMangas(Integer userId) {
        try {
            // Get user's recent reading history (last 5 manga)
            List<ReadingHistory> userHistory = readingHistoryRepository.findByUserIdOrderByUpdatedAtDesc(userId);
            List<Manga> userReadMangas = userHistory.stream()
                    .map(ReadingHistory::getManga)
                    .filter(Objects::nonNull)
                    .distinct()
                    .limit(5)
                    .collect(Collectors.toList());
            
            // Get 20 most recent manga from database
            Pageable pageable = PageRequest.of(0, 20);
            List<Manga> recentMangas = mangaRepository.findAllByOrderByCreatedAtDesc(pageable);
            
            // Convert to JSON format for Gemini API
            String userReadingHistoryJson = convertMangasToJson(userReadMangas);
            String availableMangasJson = convertMangasToJson(recentMangas);
            
            // Get recommendations from Gemini API
            List<Integer> recommendedIds = geminiService.getMangaRecommendations(
                userReadingHistoryJson, 
                availableMangasJson
            );
            
            // Fetch the recommended manga entities
            List<Manga> recommendedMangas = new ArrayList<>();
            for (Integer id : recommendedIds) {
                Optional<Manga> manga = mangaRepository.findByIdWithCategories(id);
                manga.ifPresent(recommendedMangas::add);
            }
            
            return recommendedMangas;
            
        } catch (Exception e) {
            // Fallback: return most viewed manga if AI recommendation fails
            Pageable fallbackPageable = PageRequest.of(0, 5);
            return mangaRepository.findMostViewedMangas(fallbackPageable);
        }
    }
    
    private String convertMangasToJson(List<Manga> mangas) {
        try {
            List<Map<String, Object>> mangaList = new ArrayList<>();
            
            for (Manga manga : mangas) {
                Map<String, Object> mangaMap = new HashMap<>();
                mangaMap.put("id", manga.getId());
                mangaMap.put("title", manga.getTitle());
                mangaMap.put("description", manga.getDescription());
                
                // Extract category names
                List<String> categoryNames = new ArrayList<>();
                if (manga.getCategories() != null) {
                    categoryNames = manga.getCategories().stream()
                            .map(Category::getName)
                            .collect(Collectors.toList());
                }
                mangaMap.put("genres", categoryNames);
                
                mangaList.add(mangaMap);
            }
            
            return objectMapper.writeValueAsString(mangaList);
        } catch (Exception e) {
            throw new RuntimeException("Error converting manga list to JSON", e);
        }
    }
}