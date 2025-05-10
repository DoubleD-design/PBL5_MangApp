package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.Chapter;
import com.pbl5.pbl5.modal.Page;
import com.pbl5.pbl5.repos.ChapterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ChapterService {
    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private PageService pageService;

    public List<Chapter> getAllChapters() {
        return chapterRepository.findAll();
    }

    public Optional<Chapter> getChapterById(Integer id) {
        return chapterRepository.findById(id);
    }
    
    public List<Chapter> getChaptersByMangaId(Integer mangaId) {
        return chapterRepository.findByMangaIdOrderByChapterNumberAsc(mangaId);
    }

        public Chapter createChapter(Chapter chapter, List<String> pageUrls) {
        chapter.setCreatedAt(LocalDateTime.now());
        Chapter savedChapter = chapterRepository.save(chapter);

        // Create pages for the chapter
        int pageNumber = 1;
        for (String pageUrl : pageUrls) {
            Page page = new Page();
            page.setChapterId(savedChapter.getId());
            page.setPageNumber(pageNumber++);
            page.setImageUrl(pageUrl);
            pageService.createPage(page);
        }

        return savedChapter;
    }
    
    public Chapter updateChapter(Integer id, Chapter chapterDetails) {
        return chapterRepository.findById(id).map(chapter -> {
            chapter.setTitle(chapterDetails.getTitle());
            chapter.setChapterNumber(chapterDetails.getChapterNumber());
            chapter.setManga(chapterDetails.getManga());
            return chapterRepository.save(chapter);
        }).orElse(null);
    }

    public void deleteChapter(Integer id) {
        chapterRepository.deleteById(id);
    }
    public Optional<Chapter> getChapterByMangaIdAndChapterNumber(Integer mangaId, Integer chapterNumber) {
        return chapterRepository.findByMangaIdAndChapterNumber(mangaId, chapterNumber);
    }
}
