package com.pbl5.pbl5.controller;

import com.pbl5.pbl5.modal.Chapter;
import com.pbl5.pbl5.service.ChapterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chapters")
public class ChapterController {
    @Autowired
    private ChapterService chapterService;

    @GetMapping
    public ResponseEntity<List<Chapter>> getAllChapters() {
        List<Chapter> chapters = chapterService.getAllChapters();
        return new ResponseEntity<>(chapters, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Chapter> getChapterById(@PathVariable Integer id) {
        Optional<Chapter> chapter = chapterService.getChapterById(id);
        return chapter.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/manga/{mangaId}")
    public ResponseEntity<List<Chapter>> getChaptersByMangaId(@PathVariable Integer mangaId) {
        List<Chapter> chapters = chapterService.getChaptersByMangaId(mangaId);
        return new ResponseEntity<>(chapters, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Chapter> createChapter(@RequestBody Chapter chapter) {
        Chapter newChapter = chapterService.createChapter(chapter);
        return new ResponseEntity<>(newChapter, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Chapter> updateChapter(@PathVariable Integer id, @RequestBody Chapter chapter) {
        Chapter updatedChapter = chapterService.updateChapter(id, chapter);
        if (updatedChapter != null) {
            return new ResponseEntity<>(updatedChapter, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChapter(@PathVariable Integer id) {
        chapterService.deleteChapter(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
