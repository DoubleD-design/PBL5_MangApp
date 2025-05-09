package com.pbl5.pbl5.request;

import java.util.List;

public class MangaRequestDTO {
    private String title;
    private String author;
    private String description;
    private String coverImage;
    private String status;
    private List<Integer> categoryIds; // danh sách ID của category

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<Integer> getCategoryIds() {
        return categoryIds;
    }

    public void setCategoryIds(List<Integer> categoryIds) {
        this.categoryIds = categoryIds;
    }
}
