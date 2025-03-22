package com.pbl5.pbl5.repos;

import com.pbl5.pbl5.modal.Manga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MangaRepository extends JpaRepository<Manga, Integer> {
    List<Manga> findByStatus(Manga.MangaStatus status);
    List<Manga> findByAuthorContainingIgnoreCase(String author);
    List<Manga> findByTitleContainingIgnoreCase(String title);

    // Add a Manga entity
    default Manga addManga(Manga manga) {
        return save(manga);
    }

    // Update a Manga entity
    default Manga updateManga(Manga manga) {
        return save(manga);
    }

    // Delete a Manga entity by ID
    default void deleteMangaById(Integer id) {
        deleteById(id);
    }
    List<Manga> searchByTitle(String keyword);
}

