package com.pbl5.pbl5.repos;

import com.pbl5.pbl5.modal.Manga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

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
    @Query("SELECT DISTINCT m FROM Manga m JOIN FETCH m.categories c WHERE c.id = :categoryId")
    List<Manga> findByCategoriesId(@Param("categoryId") Integer categoryId, Pageable pageable); // Method to fetch manga by category ID with pagination
    
    @Query("SELECT DISTINCT m FROM Manga m JOIN FETCH m.categories WHERE m.id = :id")
    Optional<Manga> findByIdWithCategories(@Param("id") Integer id);
    
    @Query("SELECT DISTINCT m FROM Manga m JOIN FETCH m.chapters WHERE m.id = :id")
    Optional<Manga> findByIdWithChapters(@Param("id") Integer id);
    
    // Split the query to avoid MultipleBagFetchException
    // Instead of fetching all collections at once, we'll fetch them separately
    @Query("SELECT DISTINCT m FROM Manga m WHERE m.id = :id")
    Optional<Manga> findByIdWithAllRelations(@Param("id") Integer id);
    
    // Separate queries for each collection to avoid MultipleBagFetchException
    @Query("SELECT DISTINCT m FROM Manga m LEFT JOIN FETCH m.ratings WHERE m.id = :id")
    Optional<Manga> findByIdWithRatings(@Param("id") Integer id);
    
    @Query("SELECT DISTINCT m FROM Manga m LEFT JOIN FETCH m.comments WHERE m.id = :id")
    Optional<Manga> findByIdWithComments(@Param("id") Integer id);
    
    @Query("SELECT DISTINCT m FROM Manga m LEFT JOIN FETCH m.favourites WHERE m.id = :id")
    Optional<Manga> findByIdWithFavourites(@Param("id") Integer id);
    
    @Query("SELECT DISTINCT m FROM Manga m LEFT JOIN FETCH m.readingHistories WHERE m.id = :id")
    Optional<Manga> findByIdWithReadingHistories(@Param("id") Integer id);
    
    @Query("SELECT DISTINCT m FROM Manga m LEFT JOIN FETCH m.ratings")
    List<Manga> findAllWithRatings();
    
    @Query("SELECT DISTINCT m FROM Manga m LEFT JOIN FETCH m.chapters")
    List<Manga> findAllWithChapters();
    
    @Query("SELECT m FROM Manga m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Manga> searchByTitle(@Param("keyword") String keyword);
    
    // Get recent manga ordered by creation date with categories
    @Query("SELECT DISTINCT m FROM Manga m LEFT JOIN FETCH m.categories ORDER BY m.createdAt DESC")
    List<Manga> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    // Get most viewed manga with categories
    @Query("SELECT DISTINCT m FROM Manga m LEFT JOIN FETCH m.categories ORDER BY m.views DESC")
    List<Manga> findMostViewedMangas(Pageable pageable);

}

