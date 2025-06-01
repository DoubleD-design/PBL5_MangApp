package com.pbl5.pbl5.modal;

import jakarta.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "mangas")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Manga {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
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
    @OneToMany(mappedBy = "manga", fetch = FetchType.LAZY)
    @JsonManagedReference
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Set<Chapter> chapters = new HashSet<>();
    
    @OneToMany(mappedBy = "manga", fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Set<Rating> ratings = new HashSet<>();
    
    @OneToMany(mappedBy = "manga", fetch = FetchType.LAZY)
    @JsonManagedReference("comment-manga")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Set<Comment> comments = new HashSet<>();
    
    @OneToMany(mappedBy = "manga", fetch = FetchType.LAZY)
    @JsonManagedReference
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Set<Favourite> favourites = new HashSet<>();
    
    @OneToMany(mappedBy = "manga", fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Set<ReadingHistory> readingHistories = new HashSet<>();
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "manga_categories",
        joinColumns = @JoinColumn(name = "manga_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Set<Category> categories = new HashSet<>();
    
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

    public Set<Chapter> getChapters() {
        return chapters;
    }

    public void setChapters(Set<Chapter> chapters) {
        this.chapters = chapters;
    }

    public Set<Rating> getRatings() {
        return ratings;
    }

    public void setRatings(Set<Rating> ratings) {
        this.ratings = ratings;
    }

    public Set<Comment> getComments() {
        return comments;
    }

    public void setComments(Set<Comment> comments) {
        this.comments = comments;
    }

    public Set<Favourite> getFavourites() {
        return favourites;
    }

    public void setFavourites(Set<Favourite> favourites) {
        this.favourites = favourites;
    }

    public Set<ReadingHistory> getReadingHistories() {
        return readingHistories;
    }

    public void setReadingHistories(Set<ReadingHistory> readingHistories) {
        this.readingHistories = readingHistories;
    }

    public Set<Category> getCategories() {
        return categories;
    }

    public void setCategories(Set<Category> categories) {
        this.categories = categories;
    }
    
    // Utility method to add a category
    public void addCategory(Category category) {
        this.categories.add(category);
    }
    
    // Utility method to add a chapter
    public void addChapter(Chapter chapter) {
        this.chapters.add(chapter);
    }
    
    public Integer getViews() {
        return views;
    }

    public void setViews(Integer views) {
        this.views = views;
    }
}