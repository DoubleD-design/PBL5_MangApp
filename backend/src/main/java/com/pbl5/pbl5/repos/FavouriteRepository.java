package com.pbl5.pbl5.repos;

import com.pbl5.pbl5.modal.Favourite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FavouriteRepository extends JpaRepository<Favourite, Integer> {
    List<Favourite> findByReaderId(Integer readerId);
    void deleteByReaderIdAndMangaId(Integer readerId, Integer mangaId);
}