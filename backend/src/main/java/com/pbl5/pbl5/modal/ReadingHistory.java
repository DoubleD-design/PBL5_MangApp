package com.pbl5.pbl5.modal;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "reading_history")
public class ReadingHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "user_id")
    private Integer userId;
    
    @Column(name = "manga_id")
    private Integer mangaId;
    
    @Column(name = "chapter_id")
    private Integer chapterId;
    
    @Column(name = "last_read_page")
    private Integer lastReadPage;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    @JsonBackReference("user-reading-history")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "manga_id", insertable = false, updatable = false)
    @JsonBackReference("readinghistory-manga")
    private Manga manga;
    
    @ManyToOne
    @JoinColumn(name = "chapter_id", insertable = false, updatable = false)
    @JsonBackReference("readinghistory-chapter")
    private Chapter chapter;
    
    // Getters and Setters
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Manga getManga() {
        return manga;
    }

    public void setManga(Manga manga) {
        this.manga = manga;
    }

    public Chapter getChapter() {
        return chapter;
    }

    public void setChapter(Chapter chapter) {
        this.chapter = chapter;
    }
}