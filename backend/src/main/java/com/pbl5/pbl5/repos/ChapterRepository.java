package com.pbl5.pbl5.repos;

import com.pbl5.pbl5.modal.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Integer> {
    List<Chapter> findByMangaId(Integer mangaId);
    List<Chapter> findByMangaIdOrderByChapterNumberAsc(Integer mangaId);
    //find by manga id and chapter number
    Optional<Chapter> findByMangaIdAndChapterNumber(Integer mangaId, Integer chapterNumber);
    
    @Query("SELECT DISTINCT c FROM Chapter c LEFT JOIN FETCH c.pages WHERE c.id = :id")
    Optional<Chapter> findByIdWithPages(@Param("id") Integer id);
}
