package com.pbl5.pbl5.request;

import java.time.LocalDateTime;

public class RatingRequest {
    private Integer mangaId;
    private Integer rating;
    private Integer userId;
    private LocalDateTime createdAt;

    // Getters và Setters

    public void setMangaId(Integer mangaId) {
        this.mangaId = mangaId;
    }

    public Integer getMangaId() {
        return mangaId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
