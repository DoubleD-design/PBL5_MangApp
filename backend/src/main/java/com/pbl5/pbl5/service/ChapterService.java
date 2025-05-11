package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.Chapter;
import com.pbl5.pbl5.modal.Page;
import com.pbl5.pbl5.repos.ChapterRepository;
import com.pbl5.pbl5.repos.FavouriteRepository;
import com.pbl5.pbl5.repos.PageRepository;
import com.pbl5.pbl5.repos.ReadingHistoryRepository;
import com.pbl5.pbl5.request.ChapterRequestDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class ChapterService {
    @Autowired
    private ChapterRepository chapterRepository;
    @Autowired
    private PageRepository pageRepository;
    @Autowired
    private FavouriteRepository favouriteRepository;
    @Autowired
    private ReadingHistoryRepository readingHistoryRepository;
    @Autowired
    private PageService pageService;

    public List<Chapter> getAllChapters() {
        return chapterRepository.findAll();
    }

    public Optional<Chapter> getChapterById(Integer id) {
        // Use a query that eagerly fetches pages to avoid LazyInitializationException
        return chapterRepository.findByIdWithPages(id);
    }
    
    public List<Chapter> getChaptersByMangaId(Integer mangaId) {
        return chapterRepository.findByMangaIdOrderByChapterNumberAsc(mangaId);
    }

    @Transactional
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
    
    @Transactional
    public Chapter updateChapter(Integer id, Chapter chapterDetails) {
        return chapterRepository.findById(id).map(chapter -> {
            chapter.setTitle(chapterDetails.getTitle());
            chapter.setChapterNumber(chapterDetails.getChapterNumber());
            chapter.setManga(chapterDetails.getManga());
            return chapterRepository.save(chapter);
        }).orElse(null);
    }

    @Transactional
    public void deleteChapter(Integer id) {
        // Delete all reading history entries related to the chapter
        readingHistoryRepository.deleteByChapterId(id);

        chapterRepository.findById(id).ifPresent(chapter -> {
            // Delete all pages associated with the chapter
            List<Page> pages = pageService.getPagesByChapterId(id);
            pages.forEach(page -> pageService.deletePage(page.getId()));

            // Delete the chapter
            chapterRepository.delete(chapter);
        });
    }

    public Optional<Chapter> getChapterByMangaIdAndChapterNumber(Integer mangaId, Integer chapterNumber) {
        return chapterRepository.findByMangaIdAndChapterNumber(mangaId, chapterNumber);
    }

    @Transactional
    public Chapter updateChapterWithPages(Integer id, ChapterRequestDTO dto, List<String> pageUrls) {
        return chapterRepository.findById(id).map(chapter -> {
            // Update chapter details
            chapter.setTitle(dto.getTitle());
            chapter.setChapterNumber(Float.parseFloat(dto.getChapter_number()));
            chapterRepository.save(chapter);

            // If new pages are provided, delete old pages and add new ones
            if (!pageUrls.isEmpty()) {
                pageRepository.deleteByChapterId(id);
                int pageNumber = 1;
                for (String pageUrl : pageUrls) {
                    Page page = new Page();
                    page.setChapterId(id);
                    page.setPageNumber(pageNumber++);
                    page.setImageUrl(pageUrl);
                    pageService.createPage(page);
                }
            }

            return chapter;
        }).orElseThrow(() -> new RuntimeException("Chapter not found with id: " + id));
    }
}
