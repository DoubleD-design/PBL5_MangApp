package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.Comment;
import com.pbl5.pbl5.modal.User;
import com.pbl5.pbl5.repos.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public Optional<Comment> getCommentById(Integer id) {
        return commentRepository.findById(id);
    }
    
    public List<Comment> getCommentsByMangaId(Integer mangaId) {
        return commentRepository.findByMangaIdOrderByCreatedAtDesc(mangaId);
    }
    
    public List<Comment> getCommentsByUserId(Integer userId) {
        return commentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Autowired
    private UserService userService;
    
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
    
    public Comment updateComment(Integer id, Comment commentDetails) {
        return commentRepository.findById(id).map(comment -> {
            comment.setContent(commentDetails.getContent());
            comment.setUpdatedAt(LocalDateTime.now());
            return commentRepository.save(comment);
        }).orElse(null);
    }

    public void deleteComment(Integer id) {
        commentRepository.deleteById(id);
    }
}
