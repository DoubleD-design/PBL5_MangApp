package com.pbl5.pbl5.repos;

import com.pbl5.pbl5.modal.ReadingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReadingHistoryRepository extends JpaRepository<ReadingHistory, Integer> {
    List<ReadingHistory> findByUserId(Integer userId);
    List<ReadingHistory> findByMangaId(Integer mangaId);
    List<ReadingHistory> findByUserIdAndMangaId(Integer userId, Integer mangaId);
    void deleteByMangaId(Integer id);
    void deleteByChapterId(Integer id);
}
