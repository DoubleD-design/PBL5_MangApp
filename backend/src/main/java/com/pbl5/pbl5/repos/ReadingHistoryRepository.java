package com.pbl5.pbl5.repos;

import com.pbl5.pbl5.modal.ReadingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReadingHistoryRepository extends JpaRepository<ReadingHistory, Integer> {
    List<ReadingHistory> findByUserId(Integer userId);
    List<ReadingHistory> findByMangaId(Integer mangaId);
    List<ReadingHistory> findByUserIdAndMangaId(Integer userId, Integer mangaId);
    void deleteByMangaId(Integer id);
    void deleteByChapterId(Integer id);

    Optional<ReadingHistory> findByUserIdAndMangaIdAndChapterId(Integer userId, Integer mangaId, Integer chapterId);
    
    // Get user reading history with manga and categories, ordered by update time
    @Query("SELECT DISTINCT rh FROM ReadingHistory rh " +
           "LEFT JOIN FETCH rh.manga m " +
           "LEFT JOIN FETCH m.categories " +
           "WHERE rh.userId = :userId " +
           "ORDER BY rh.updatedAt DESC")
    List<ReadingHistory> findByUserIdOrderByUpdatedAtDesc(@Param("userId") Integer userId);
}
