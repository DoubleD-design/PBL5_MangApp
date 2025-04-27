package com.pbl5.pbl5.repos;

import com.pbl5.pbl5.modal.Manga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MangaRepository extends JpaRepository<Manga, Integer> {
    List<Manga> findByStatus(Manga.MangaStatus status);
    @Query("SELECT m FROM Manga m WHERE LOWER(m.author) LIKE LOWER(CONCAT('%', :author, '%'))")
    List<Manga> findByAuthorContainingIgnoreCase(@Param("author") String author);
    List<Manga> findByTitleContainingIgnoreCase(String title);
    // Get all Manga entities without loading chapters
    default List<Manga> getAllMangas() {
        List<Manga> mangas = findAll();
        // Clear chapters to avoid loading them in the response
        for (Manga manga : mangas) {
            manga.setChapters(null);
        }
        return mangas;
    }


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
    @Query("SELECT DISTINCT m FROM Manga m JOIN m.categories c WHERE c.id = :categoryId")
    List<Manga> findByCategoriesId(@Param("categoryId") Integer categoryId, Pageable pageable); // Method to fetch manga by category ID with pagination
    @Query("SELECT m FROM Manga m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Manga> searchByTitle(@Param("keyword") String keyword);

}

