package com.pbl5.pbl5.response;

import java.time.LocalDateTime;

public class ReadingHistoryResponse {
    private Integer mangaId;
    private String mangaTitle;
    private Integer chapterId;
    private String chapterTitle;
    private Integer lastReadPage;
    private LocalDateTime updatedAt;

    // Getters and Setters
    public Integer getMangaId() {
        return mangaId;
    }

    public void setMangaId(Integer mangaId) {
        this.mangaId = mangaId;
    }

    public String getMangaTitle() {
        return mangaTitle;
    }

    public void setMangaTitle(String mangaTitle) {
        this.mangaTitle = mangaTitle;
    }

    public Integer getChapterId() {
        return chapterId;
    }

    public void setChapterId(Integer chapterId) {
        this.chapterId = chapterId;
    }

    public String getChapterTitle() {
        return chapterTitle;
    }

    public void setChapterTitle(String chapterTitle) {
        this.chapterTitle = chapterTitle;
    }

    public Integer getLastReadPage() {
        return lastReadPage;
    }

    public void setLastReadPage(Integer lastReadPage) {
        this.lastReadPage = lastReadPage;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
