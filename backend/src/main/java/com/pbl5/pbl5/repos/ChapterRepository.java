package com.pbl5.pbl5.repos;

import com.pbl5.pbl5.modal.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Integer> {
    List<Chapter> findByMangaId(Integer mangaId);
    List<Chapter> findByMangaIdOrderByChapterNumberAsc(Integer mangaId);
    //find by manga id and chapter number
    Optional<Chapter> findByMangaIdAndChapterNumber(Integer mangaId, Integer chapterNumber);
}
