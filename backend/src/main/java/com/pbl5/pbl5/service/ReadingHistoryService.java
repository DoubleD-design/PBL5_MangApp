package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.ReadingHistory;
import com.pbl5.pbl5.repos.ReadingHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReadingHistoryService {
    @Autowired
    private ReadingHistoryRepository readingHistoryRepository;

    public List<ReadingHistory> getAllReadingHistories() {
        return readingHistoryRepository.findAll();
    }

    public Optional<ReadingHistory> getReadingHistoryById(Integer id) {
        return readingHistoryRepository.findById(id);
    }
    
    public List<ReadingHistory> getReadingHistoriesByUserId(Integer userId) {
        return readingHistoryRepository.findByUserId(userId);
    }
    
    public List<ReadingHistory> getReadingHistoriesByMangaId(Integer mangaId) {
        return readingHistoryRepository.findByMangaId(mangaId);
    }
    
    public List<ReadingHistory> getReadingHistoriesByUserIdAndMangaId(Integer userId, Integer mangaId) {
        return readingHistoryRepository.findByUserIdAndMangaId(userId, mangaId);
    }
    
    public ReadingHistory findOrCreateReadingHistory(Integer userId, Integer mangaId, Integer chapterId) {
        List<ReadingHistory> existingHistories = readingHistoryRepository.findByUserIdAndMangaId(userId, mangaId);
        
        ReadingHistory readingHistory;
        if (!existingHistories.isEmpty()) {
            // Update existing history
            readingHistory = existingHistories.get(0);
            readingHistory.setChapterId(chapterId);
            readingHistory.setUpdatedAt(LocalDateTime.now());
        } else {
            // Create new history
            readingHistory = new ReadingHistory();
            readingHistory.setUserId(userId);
            readingHistory.setMangaId(mangaId);
            readingHistory.setChapterId(chapterId);
            readingHistory.setUpdatedAt(LocalDateTime.now());
        }
        
        return readingHistoryRepository.save(readingHistory);
    }

    public ReadingHistory createReadingHistory(ReadingHistory readingHistory) {
        readingHistory.setUpdatedAt(LocalDateTime.now());
        return readingHistoryRepository.save(readingHistory);
    }

    public void deleteReadingHistory(Integer id) {
        readingHistoryRepository.deleteById(id);
    }
    
    public void deleteReadingHistoriesByUserId(Integer userId) {
        List<ReadingHistory> userHistories = readingHistoryRepository.findByUserId(userId);
        readingHistoryRepository.deleteAll(userHistories);
    }
}
