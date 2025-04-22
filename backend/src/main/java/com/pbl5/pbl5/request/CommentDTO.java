package com.pbl5.pbl5.request;

import com.pbl5.pbl5.modal.Comment;

import java.time.LocalDateTime;

public class CommentDTO {
    private Integer id;
    private Integer userId;
    private String username;
    private String content;
    private LocalDateTime createdAt;

    public CommentDTO(Comment comment) {
        this.id = comment.getId();
        this.userId = comment.getUserId();
        this.username = comment.getUser() != null ? comment.getUser().getUsername() : "Anonymous";
        this.content = comment.getContent();
        this.createdAt = comment.getCreatedAt();
    }

    // Getters and setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
