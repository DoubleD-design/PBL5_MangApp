package com.pbl5.pbl5.response;

import java.time.LocalDateTime;

public class UserProfileResponse {
    private Integer id;
    private String username;
    private String email;
    private Boolean vipStatus;
    private LocalDateTime vipStartDate;
    private LocalDateTime vipEndDate;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getVipStatus() {
        return vipStatus;
    }

    public void setVipStatus(Boolean vipStatus) {
        this.vipStatus = vipStatus;
    }

    public LocalDateTime getVipStartDate() {
        return vipStartDate;
    }

    public void setVipStartDate(LocalDateTime vipStartDate) {
        this.vipStartDate = vipStartDate;
    }

    public LocalDateTime getVipEndDate() {
        return vipEndDate;
    }

    public void setVipEndDate(LocalDateTime vipEndDate) {
        this.vipEndDate = vipEndDate;
    }
}
