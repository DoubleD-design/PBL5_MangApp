package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.Comment;
import com.pbl5.pbl5.modal.User;
import com.pbl5.pbl5.repos.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    @Cacheable("comments")
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    @Cacheable(value = "comments", key = "#id")
    public Optional<Comment> getCommentById(Integer id) {
        return commentRepository.findById(id);
    }
    
    @Cacheable(value = "commentsByManga", key = "#mangaId")
    public List<Comment> getCommentsByMangaId(Integer mangaId) {
        return commentRepository.findByMangaIdOrderByCreatedAtDesc(mangaId);
    }
    
    @Cacheable(value = "commentsByUser", key = "#userId")
    public List<Comment> getCommentsByUserId(Integer userId) {
        return commentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Autowired
    private UserService userService;
    
    @Caching(evict = {
        @CacheEvict(value = "comments", allEntries = true),
        @CacheEvict(value = "commentsByManga", key = "#comment.mangaId"),
        @CacheEvict(value = "commentsByUser", key = "#comment.userId")
    })
    public Comment createComment(Comment comment) {
        // Check if user is allowed to comment
        Optional<User> userOpt = userService.getUserById(comment.getUserId());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getAbleToComment() != null && !user.getAbleToComment()) {
                throw new RuntimeException("You are not allowed to comment. Please contact administrator.");
            }
        }
        
        comment.setCreatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }
    
    @Caching(evict = {
        @CacheEvict(value = "comments", key = "#id"),
        @CacheEvict(value = "comments", allEntries = true),
        @CacheEvict(value = "commentsByManga", allEntries = true),
        @CacheEvict(value = "commentsByUser", allEntries = true)
    })
    public Comment updateComment(Integer id, Comment commentDetails) {
        return commentRepository.findById(id).map(comment -> {
            comment.setContent(commentDetails.getContent());
            comment.setUpdatedAt(LocalDateTime.now());
            return commentRepository.save(comment);
        }).orElse(null);
    }

    @Caching(evict = {
        @CacheEvict(value = "comments", key = "#id"),
        @CacheEvict(value = "comments", allEntries = true),
        @CacheEvict(value = "commentsByManga", allEntries = true),
        @CacheEvict(value = "commentsByUser", allEntries = true)
    })
    public void deleteComment(Integer id) {
        commentRepository.deleteById(id);
    }
}
