package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.Comment;
import com.pbl5.pbl5.modal.Favourite;
import com.pbl5.pbl5.modal.Manga;
import com.pbl5.pbl5.modal.Notification;
import com.pbl5.pbl5.modal.User;
import com.pbl5.pbl5.repos.CommentRepository;
import com.pbl5.pbl5.repos.FavouriteRepository;
import com.pbl5.pbl5.repos.MangaRepository;
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
    // Add these for notification
    @Autowired
    private FavouriteRepository favouriteRepository;
    @Autowired
    private MangaRepository mangaRepository;
    @Autowired
    private NotificationService notificationService;
    
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
        Comment savedComment = commentRepository.save(comment);

        // --- Notify all users who favorited this manga (except the commenter) ---
        List<Favourite> favourites = favouriteRepository.findByMangaId(comment.getMangaId());
        String mangaTitle = "";
        Optional<Manga> mangaOpt = mangaRepository.findById(comment.getMangaId());
        if (mangaOpt.isPresent()) {
            mangaTitle = mangaOpt.get().getTitle();
        }
        for (Favourite fav : favourites) {
            if (fav.getReaderId().equals(comment.getUserId())) continue; // Don't notify the commenter
            Notification notification = new Notification();
            notification.setUserId(fav.getReaderId());
            notification.setMangaId(comment.getMangaId()); // for frontend routing
            notification.setMessage(
                "Your favourite manga: " + (mangaTitle != null && !mangaTitle.isEmpty() ? mangaTitle : "ID " + comment.getMangaId())
                + " has a new comment. Click to see."
            );
            notification.setIsRead(false);
            notification.setCreatedAt(LocalDateTime.now());
            notificationService.createNotification(notification);
        }
        // --- end notify ---

        return savedComment;
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
