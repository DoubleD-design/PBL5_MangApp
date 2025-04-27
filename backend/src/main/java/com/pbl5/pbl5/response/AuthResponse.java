package com.pbl5.pbl5.response;

import com.pbl5.pbl5.modal.User;

public class AuthResponse {
    private String jwt;
    private String message;
    private boolean status;
    private User user; 

    public AuthResponse() {
    }

    public AuthResponse(String jwt, String message, boolean status, User user) {
        this.jwt = jwt;
        this.message = message;
        this.status = status;
        this.user = user;
    }

    // Getter và Setter
    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}