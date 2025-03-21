package com.pbl5.pbl5.controller;

import com.pbl5.pbl5.modal.*;
import com.pbl5.pbl5.service.*;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mangas")
public class MangaController {
    @Autowired
    private MangaService mangaService;

    @GetMapping
    public List<Manga> getAllMangas() {
        return mangaService.getAllMangas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Manga> getMangaById(@PathVariable Integer id) {
        return ResponseEntity.of(mangaService.getMangaById(id));
    }

    @PostMapping
    public Manga createManga(@RequestBody Manga manga) {
        return mangaService.createManga(manga);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Manga> updateManga(@PathVariable Integer id, @RequestBody Manga manga) {
        return ResponseEntity.of(Optional.ofNullable(mangaService.updateManga(id, manga)));
    }

    @DeleteMapping("/{id}")
    public void deleteManga(@PathVariable Integer id) {
        mangaService.deleteManga(id);
    }
}

