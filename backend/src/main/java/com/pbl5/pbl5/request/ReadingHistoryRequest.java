package com.pbl5.pbl5.request;

public class ReadingHistoryRequest {
    private Integer mangaId;
    private Integer chapterId;

    // Getters and Setters
    public Integer getMangaId() {
        return mangaId;
    }

    public void setMangaId(Integer mangaId) {
        this.mangaId = mangaId;
    }

    public Integer getChapterId() {
        return chapterId;
    }

    public void setChapterId(Integer chapterId) {
        this.chapterId = chapterId;
    }
}
