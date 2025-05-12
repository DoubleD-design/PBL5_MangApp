package com.pbl5.pbl5.request;

import jakarta.validation.constraints.NotNull;

public class VipSubscriptionRequest {
    @NotNull
    private Integer userId;
    
    @NotNull
    private String packageType; // "MONTHLY" or "ANNUAL"
    
    public Integer getUserId() {
        return userId;
    }
    
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    
    public String getPackageType() {
        return packageType;
    }
    
    public void setPackageType(String packageType) {
        this.packageType = packageType;
    }
}