package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.Chapter;
import com.pbl5.pbl5.repos.ChapterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChapterService {
    @Autowired
    private ChapterRepository chapterRepository;

    public List<Chapter> getAllChapters() {
        return chapterRepository.findAll();
    }

    public Optional<Chapter> getChapterById(Integer id) {
        return chapterRepository.findById(id);
    }

    public Chapter createChapter(Chapter chapter) {
        return chapterRepository.save(chapter);
    }

    public void deleteChapter(Integer id) {
        chapterRepository.deleteById(id);
    }
}
