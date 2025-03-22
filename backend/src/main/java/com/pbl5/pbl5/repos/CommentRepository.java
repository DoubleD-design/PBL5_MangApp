package com.pbl5.pbl5.repos;

import com.pbl5.pbl5.modal.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    // Lấy danh sách comment theo mangaId, sắp xếp theo thời gian tạo mới nhất
    List<Comment> findByMangaIdOrderByCreatedAtDesc(Integer mangaId);

    // Lấy danh sách comment của một user
    List<Comment> findByUserId(Integer userId);
}
