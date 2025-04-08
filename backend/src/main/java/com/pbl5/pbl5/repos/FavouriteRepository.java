package com.pbl5.pbl5.repos;

import com.pbl5.pbl5.modal.Favourite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface FavouriteRepository extends JpaRepository<Favourite, Integer> {
    List<Favourite> findByUserId(Integer userId);
    List<Favourite> findByMangaId(Integer mangaId);
    boolean existsByUserIdAndMangaId(Integer userId, Integer mangaId);
    
    @Modifying
    @Transactional
    void deleteByUserIdAndMangaId(Integer userId, Integer mangaId);
    List<Favourite> findByReaderId(Integer readerId);
    void deleteByReaderIdAndMangaId(Integer readerId, Integer mangaId);
}