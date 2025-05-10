package com.pbl5.pbl5.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pbl5.pbl5.modal.Chapter;
import com.pbl5.pbl5.modal.Manga;
import com.pbl5.pbl5.modal.Page;
import com.pbl5.pbl5.modal.User;
import com.pbl5.pbl5.repos.UserRepository;
import com.pbl5.pbl5.request.ChapterRequestDTO;
import com.pbl5.pbl5.request.MangaRequestDTO;
import com.pbl5.pbl5.service.AzureBlobService;
import com.pbl5.pbl5.service.ChapterService;
import com.pbl5.pbl5.service.MangaService;
import com.pbl5.pbl5.service.PageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chapters")
public class ChapterController {
    @Autowired
    private ChapterService chapterService;
    
    @Autowired
    private PageService pageService;
    @Autowired
    private MangaService mangaService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AzureBlobService azureBlobService;
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
    @GetMapping("/manga/{mangaId}/chapter/{chapterNumber}")
    public ResponseEntity<Chapter> getChapterByMangaIdAndChapterNumber(
            @PathVariable Integer mangaId,
            @PathVariable Integer chapterNumber) {

        Optional<Chapter> chapter = chapterService.getChapterByMangaIdAndChapterNumber(mangaId, chapterNumber);
        return chapter.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @GetMapping("/{chapterId}/pages")
    public ResponseEntity<List<Page>> getChapterPages(@PathVariable Integer chapterId) {
        Optional<Chapter> chapter = chapterService.getChapterById(chapterId);
        if (chapter.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        List<Page> pages = pageService.getPagesByChapterId(chapterId);
        return new ResponseEntity<>(pages, HttpStatus.OK);
    }
    
    @GetMapping("/manga/{mangaId}/chapter/{chapterNumber}/pages")
    public ResponseEntity<List<Page>> getChapterPagesByMangaIdAndChapterNumber(
            @PathVariable Integer mangaId,
            @PathVariable Integer chapterNumber) {
            
        Optional<Chapter> chapter = chapterService.getChapterByMangaIdAndChapterNumber(mangaId, chapterNumber);
        if (chapter.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        List<Page> pages = pageService.getPagesByChapterId(chapter.get().getId());
        return new ResponseEntity<>(pages, HttpStatus.OK);
    }

    @GetMapping("/manga/{mangaId}")
    public ResponseEntity<List<Chapter>> getChaptersByMangaId(@PathVariable Integer mangaId) {
        List<Chapter> chapters = chapterService.getChaptersByMangaId(mangaId);
        return new ResponseEntity<>(chapters, HttpStatus.OK);
    }

    @PostMapping(value = "/create", consumes = {"multipart/form-data"})
    public ResponseEntity<?> createChapterWithImages(
            @RequestPart("dataForm") String dataForm,
            @RequestPart(value = "files", required = false) MultipartFile[] files) {
        try {
            // Parse dữ liệu JSON thành DTO
            ObjectMapper mapper = new ObjectMapper();
            ChapterRequestDTO dto = mapper.readValue(dataForm, ChapterRequestDTO.class);
            
            // Upload chapter pages to Azure Blob
            List<String> pageUrls = azureBlobService.uploadChapterPages(dto.getManga_id(), dto.getChapter_number(), files);

            // Create chapter and pages
            Chapter chapter = new Chapter();
            chapter.setMangaId(Integer.parseInt(dto.getManga_id()));
            chapter.setChapterNumber(Float.parseFloat(dto.getChapter_number()));
            chapter.setTitle(dto.getTitle());
            Chapter newChapter = chapterService.createChapter(chapter, pageUrls);

            return new ResponseEntity<>(newChapter, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating chapter: " + e.getMessage());
        }
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

    @GetMapping("/manga/{mangaId}/chapter/{chapterNumber}/next")
    public ResponseEntity<Chapter> getNextChapter(
            @PathVariable Integer mangaId,
            @PathVariable Float chapterNumber) {

        List<Chapter> chapters = chapterService.getChaptersByMangaId(mangaId);

        // Find the next chapter number
        Optional<Chapter> nextChapter = chapters.stream()
                .filter(c -> c.getChapterNumber() > chapterNumber)
                .min(Comparator.comparing(Chapter::getChapterNumber));

        return nextChapter.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/manga/{mangaId}/chapter/{chapterNumber}/previous")
    public ResponseEntity<Chapter> getPreviousChapter(
            @PathVariable Integer mangaId,
            @PathVariable Float chapterNumber) {

        List<Chapter> chapters = chapterService.getChaptersByMangaId(mangaId);

        // Find the previous chapter number
        Optional<Chapter> previousChapter = chapters.stream()
                .filter(c -> c.getChapterNumber() < chapterNumber)
                .max(Comparator.comparing(Chapter::getChapterNumber));

        return previousChapter.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
