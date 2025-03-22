package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.ReadingHistory;
import com.pbl5.pbl5.repos.ReadingHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public ReadingHistory createReadingHistory(ReadingHistory readingHistory) {
        return readingHistoryRepository.save(readingHistory);
    }

    public void deleteReadingHistory(Integer id) {
        readingHistoryRepository.deleteById(id);
    }
}
