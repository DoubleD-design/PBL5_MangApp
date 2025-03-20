package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.Manga;
import com.pbl5.pbl5.repos.MangaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MangaService {
    @Autowired
    private MangaRepository mangaRepository;

    public List<Manga> getAllManga() {
        return mangaRepository.findAll();
    }

    public Optional<Manga> getMangaById(Integer id) {
        return mangaRepository.findById(id);
    }

    public Manga createManga(Manga manga) {
        return mangaRepository.save(manga);
    }

    public Manga updateManga(Integer id, Manga mangaDetails) {
        return mangaRepository.findById(id).map(manga -> {
            manga.setTitle(mangaDetails.getTitle());
            manga.setCategories(mangaDetails.getCategories());
            manga.setAuthor(mangaDetails.getAuthor());
            return mangaRepository.save(manga);
        }).orElse(null);
    }

    public void deleteManga(Integer id) {
        mangaRepository.deleteById(id);
    }

    public List<Manga> searchByTitle(String keyword) {
        return mangaRepository.searchByTitle(keyword);
    }
}
