package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.Chapter;
import com.pbl5.pbl5.modal.Favourite;
import com.pbl5.pbl5.modal.Manga;
import com.pbl5.pbl5.modal.Notification;
import com.pbl5.pbl5.modal.Page;
import com.pbl5.pbl5.repos.ChapterRepository;
import com.pbl5.pbl5.repos.FavouriteRepository;
import com.pbl5.pbl5.repos.PageRepository;
import com.pbl5.pbl5.repos.ReadingHistoryRepository;
import com.pbl5.pbl5.request.ChapterRequestDTO;
import com.pbl5.pbl5.repos.MangaRepository;

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
    private ReadingHistoryRepository readingHistoryRepository;
    @Autowired
    private PageService pageService;
    @Autowired
    private FavouriteRepository favouriteRepository; // repo cho bảng favourite
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private MangaRepository mangaRepository; // Thêm dòng này

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
        // Gửi thông báo cho user đã yêu thích truyện này
        List<Favourite> favourites = favouriteRepository.findByMangaId(chapter.getMangaId());
        // Lấy tên manga để đưa vào message
        String mangaTitle = "";
        try {
            mangaTitle = chapter.getManga() != null ? chapter.getManga().getTitle() : "";
        } catch (Exception e) {
            mangaTitle = "";
        }
        // Nếu không lấy được từ chapter.getManga(), có thể lấy từ DB (tối ưu hơn)
        if (mangaTitle == null || mangaTitle.isEmpty()) {
            // Lấy từ DB
            // Giả sử có MangaRepository, nếu không có thì bỏ qua
            Optional<Manga> mangaOpt = mangaRepository.findById(chapter.getMangaId());
            if (mangaOpt.isPresent()) {
                mangaTitle = mangaOpt.get().getTitle();
            }
        }
        for (Favourite fav : favourites) {
            Notification notification = new Notification();
            notification.setUserId(fav.getReaderId());
            // Thông báo tiếng Anh, có tên manga và id
            notification.setMessage(
                "New chapter for your favorite manga: " +
                (mangaTitle != null && !mangaTitle.isEmpty() ? mangaTitle : "ID " + chapter.getMangaId()) +
                " - Chapter: " + chapter.getTitle() + ". Click to read!"
            );
            notification.setIsRead(false);
            notification.setCreatedAt(LocalDateTime.now());
            notificationService.createNotification(notification);
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
