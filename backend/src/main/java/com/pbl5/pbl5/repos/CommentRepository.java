package com.pbl5.pbl5.repos;

import com.pbl5.pbl5.modal.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByMangaId(Integer mangaId);
    List<Comment> findByMangaIdOrderByCreatedAtDesc(Integer mangaId);
    List<Comment> findByUserId(Integer userId);
    List<Comment> findByUserIdOrderByCreatedAtDesc(Integer userId);
}
