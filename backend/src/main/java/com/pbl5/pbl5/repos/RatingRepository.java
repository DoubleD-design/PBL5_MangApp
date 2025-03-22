package com.pbl5.pbl5.repos;

import com.pbl5.pbl5.modal.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {
    List<Rating> findByUserId(Integer userId);
    List<Rating> findByMangaId(Integer mangaId);
}