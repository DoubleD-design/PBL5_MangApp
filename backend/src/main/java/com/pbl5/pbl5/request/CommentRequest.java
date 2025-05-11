package com.pbl5.pbl5.request;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
// CommentRequest.java
public class CommentRequest {
    private Integer mangaId;
    private String content;
    private LocalDateTime createdAt;
    private Integer userId;
    public Integer getUserId() {
        return userId;
    }
    public void setUserId(Integer userId) {
        
    }

    public Integer getMangaId() {
        return mangaId;
    }

    public void setMangaId(Integer mangaId) {
        this.mangaId = mangaId;
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
// Nếu muốn lấy user từ token, không cần userId ở đây
    // Nếu chưa dùng token thì bạn có thể thêm userId

    // Getters and Setters
}
