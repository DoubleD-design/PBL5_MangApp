package com.pbl5.pbl5.controller;

import com.pbl5.pbl5.modal.*;
import com.pbl5.pbl5.repos.UserRepository;
import com.pbl5.pbl5.request.MangaRequestDTO;
import com.pbl5.pbl5.service.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/manga")
public class MangaController {
    @Autowired
    private MangaService mangaService;
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedMangas() {
        try {
            List<Manga> featuredMangas = mangaService.getFeaturedMangas();
            return ResponseEntity.ok(featuredMangas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching featured mangas: " + e.getMessage());
        }
    }
    
    @GetMapping("/latest")
    public ResponseEntity<?> getLatestUpdates(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        try {
            List<Manga> latestMangas = mangaService.getLatestUpdates();
            
            // Manual pagination
            int start = page * size;
            int end = Math.min(start + size, latestMangas.size());

            if (start >= latestMangas.size()) {
                return ResponseEntity.ok(new HashMap<String, Object>() {{
                    put("content", new ArrayList<>());
                    put("currentPage", page);
                    put("totalItems", latestMangas.size());
                    put("totalPages", (int) Math.ceil((double) latestMangas.size() / size));
                }});
            }
            
            List<Manga> paginatedMangas = latestMangas.subList(start, end);
            
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("content", paginatedMangas);
            response.put("currentPage", page);
            response.put("totalItems", latestMangas.size());
            response.put("totalPages", (int) Math.ceil((double) latestMangas.size() / size));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching latest mangas: " + e.getMessage());
        }
    }
    

    @GetMapping
    public ResponseEntity<?> getAllMangas(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        try {
            List<Manga> mangas = mangaService.getAllMangas();
            
            // Manual pagination since we don't have Spring Data pagination
            int start = page * size;
            int end = Math.min(start + size, mangas.size());
            List<Manga> paginatedMangas;
            
            if (start >= mangas.size()) {
                start = 0;
                end = Math.min(size, mangas.size());
            }
            paginatedMangas = mangas.subList(start, end);
            
            // Create a response object with pagination info
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("content", paginatedMangas);
            response.put("currentPage", page);
            response.put("totalItems", mangas.size());
            response.put("totalPages", (int) Math.ceil((double) mangas.size() / size));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching mangas: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Manga> getMangaById(@PathVariable Integer id) {
        return ResponseEntity.of(mangaService.getMangaById(id));
    }

    @PostMapping(value = "/create", consumes = {"multipart/form-data"})
    public ResponseEntity<?> createMangaWithForm(
            @RequestPart("dataForm") String dataForm,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            MangaRequestDTO dto = mapper.readValue(dataForm, MangaRequestDTO.class);
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Manga manga = mangaService.uploadAndSave(dto, image, user.getId(), false, null);
            return ResponseEntity.ok(manga);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating manga: " + e.getMessage());
        }
    }

    @PutMapping(value = "/update/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateMangaWithForm(
            @PathVariable Integer id,
            @RequestPart("dataForm") String dataForm,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            // Parse JSON data
            ObjectMapper mapper = new ObjectMapper();
            MangaRequestDTO dto = mapper.readValue(dataForm, MangaRequestDTO.class);
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Manga manga = mangaService.uploadAndSave(dto, image, user.getId(), true, id);
            return ResponseEntity.ok(manga);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating manga: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public void deleteManga(@PathVariable Integer id) {
        mangaService.deleteManga(id);
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchMangas(
        @RequestParam String query,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "title") String type) {
        try {
            List<Manga> searchResults;
            
            // Perform search based on type
            if ("author".equalsIgnoreCase(type)) {
                searchResults = mangaService.searchByAuthor(query);
            } else if ("all".equalsIgnoreCase(type)) {
                searchResults = mangaService.searchByAll(query);
            } else {
                // Default to title search
                searchResults = mangaService.searchByTitle(query);
            }
            
            // Manual pagination
            int start = page * size;
            int end = Math.min(start + size, searchResults.size());
            
            if (start > searchResults.size()) {
                start = 0;
                end = Math.min(size, searchResults.size());
            }
            
            List<Manga> paginatedResults = searchResults.subList(start, end);
            
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("content", paginatedResults);
            response.put("currentPage", page);
            response.put("totalItems", searchResults.size());
            response.put("totalPages", (int) Math.ceil((double) searchResults.size() / size));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error searching mangas: " + e.getMessage());
        }
    }
    
    @PostMapping("/{id}/increment-views")
    public ResponseEntity<?> incrementViews(@PathVariable Integer id) {
        try {
            Manga updatedManga = mangaService.incrementViews(id);
            if (updatedManga != null) {
                return ResponseEntity.ok(updatedManga);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error incrementing views: " + e.getMessage());
        }
    }
    
    @GetMapping("/most-viewed")
    public ResponseEntity<?> getMostViewedMangas(@RequestParam(defaultValue = "7") int limit) {
        try {
            List<Manga> mostViewedMangas = mangaService.getMostViewedMangas(limit);
            return ResponseEntity.ok(mostViewedMangas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching most viewed mangas: " + e.getMessage());
        }
    }
    
    @GetMapping("/ranking")
    public ResponseEntity<?> getRankedMangas(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size,
        @RequestParam(defaultValue = "40") int limit) {
        try {
            List<Manga> rankedMangas = mangaService.getMostViewedMangas(limit);
            
            // Manual pagination
            int start = page * size;
            int end = Math.min(start + size, rankedMangas.size());
            
            if (start >= rankedMangas.size()) {
                return ResponseEntity.ok(new HashMap<String, Object>() {{
                    put("content", new ArrayList<>());
                    put("currentPage", page);
                    put("totalItems", rankedMangas.size());
                    put("totalPages", (int) Math.ceil((double) rankedMangas.size() / size));
                }});
            }
            
            List<Manga> paginatedMangas = rankedMangas.subList(start, end);
            
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("content", paginatedMangas);
            response.put("currentPage", page);
            response.put("totalItems", rankedMangas.size());
            response.put("totalPages", (int) Math.ceil((double) rankedMangas.size() / size));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching ranked mangas: " + e.getMessage());
        }
    }
    
    @GetMapping("/categories/{categoryId}/manga")
    public ResponseEntity<?> getMangaByCategory(
        @PathVariable Integer categoryId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "8") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            List<Manga> mangas = mangaService.findByCategoriesId(categoryId, pageable);
            
            // Create a response object with pagination info
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("content", mangas);
            response.put("currentPage", page);
            response.put("totalItems", mangas.size());
            response.put("totalPages", (int) Math.ceil((double) mangas.size() / size));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching mangas by category: " + e.getMessage());
        }
    }
}

