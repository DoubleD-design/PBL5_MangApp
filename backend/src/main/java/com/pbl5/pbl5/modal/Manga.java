package com.pbl5.pbl5.modal;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "mangas")
public class Manga {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(length = 255)
    private String title;
    
    @Column
    private String description;
    
    @Column(name = "cover_image")
    private String coverImage;
    
    @Column(length = 100)
    private String author;
    
    @Column
    @Enumerated(EnumType.STRING)
    private MangaStatus status;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "admin_id")
    private Integer adminId;
    
    @Column(name = "views")
    private Integer views = 0;
    // Relationships
    @OneToMany(mappedBy = "manga")
    @JsonManagedReference
    private List<Chapter> chapters;
    
    @OneToMany(mappedBy = "manga")
    private List<Rating> ratings;
    
    @OneToMany(mappedBy = "manga")
    @JsonManagedReference("comment-manga")
    private List<Comment> comments;
    
    @OneToMany(mappedBy = "manga")
    @JsonManagedReference
    private List<Favourite> favourites;
    
    @OneToMany(mappedBy = "manga")
    private List<ReadingHistory> readingHistories;
    
    @ManyToMany
    @JoinTable(
        name = "manga_categories",
        joinColumns = @JoinColumn(name = "manga_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories;
    
    // Enum for manga status
    public enum MangaStatus {
        ONGOING,
        COMPLETED,
        HIATUS
    }
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public MangaStatus getStatus() {
        return status;
    }

    public void setStatus(MangaStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getAdminId() {
        return adminId;
    }

    public void setAdminId(Integer adminId) {
        this.adminId = adminId;
    }

    public List<Chapter> getChapters() {
        return chapters;
    }

    public void setChapters(List<Chapter> chapters) {
        this.chapters = chapters;
    }

    public List<Rating> getRatings() {
        return ratings;
    }

    public void setRatings(List<Rating> ratings) {
        this.ratings = ratings;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public List<Favourite> getFavourites() {
        return favourites;
    }

    public void setFavourites(List<Favourite> favourites) {
        this.favourites = favourites;
    }

    public List<ReadingHistory> getReadingHistories() {
        return readingHistories;
    }

    public void setReadingHistories(List<ReadingHistory> readingHistories) {
        this.readingHistories = readingHistories;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }
    
    public Integer getViews() {
        return views;
    }

    public void setViews(Integer views) {
        this.views = views;
    }
}