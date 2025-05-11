package com.pbl5.pbl5.controller;

import com.pbl5.pbl5.modal.Comment;
import com.pbl5.pbl5.modal.User;
import com.pbl5.pbl5.repos.UserRepository;
import com.pbl5.pbl5.request.CommentDTO;
import com.pbl5.pbl5.request.CommentRequest;
import com.pbl5.pbl5.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comments")  
public class CommentController {
    @Autowired
    private CommentService commentService;
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<List<Comment>> getAllComments() {
        List<Comment> comments = commentService.getAllComments();
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable Integer id) {
        Optional<Comment> comment = commentService.getCommentById(id);
        return comment.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/manga/{mangaId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByMangaId(@PathVariable Integer mangaId) {
        List<Comment> comments = commentService.getCommentsByMangaId(mangaId);
        List<CommentDTO> result = comments.stream()
                .map(CommentDTO::new)
                .toList();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Comment>> getCommentsByUserId(@PathVariable Integer userId) {
        List<Comment> comments = commentService.getCommentsByUserId(userId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody CommentRequest request) {
        // Lấy username từ token
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        // Tìm user trong DB
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tạo comment
        Comment comment = new Comment();
        LocalDateTime currentTime = LocalDateTime.now();
        comment.setCreatedAt(currentTime);
        comment.setUserId(user.getId());
        comment.setMangaId(request.getMangaId());
        comment.setContent(request.getContent());

        Comment saved = commentService.createComment(comment);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable Integer id, @RequestBody CommentRequest commentRequest) {
        // Lấy username từ token
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        // Tìm user trong DB
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Comment comment = new Comment();
        comment.setUserId(user.getId());
        comment.setMangaId(commentRequest.getMangaId());
        comment.setContent(commentRequest.getContent());
        comment.setCreatedAt(commentRequest.getCreatedAt());
        Comment updatedComment = commentService.updateComment(id, comment);
        if (updatedComment != null) {
            return new ResponseEntity<>(updatedComment, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Integer id) {
        commentService.deleteComment(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
