package com.pbl5.pbl5.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PayPalConfig {
    @Value("${paypal.client.id}")
    private String clientId;
    
    @Value("${paypal.client.secret}")
    private String clientSecret;
    
    @Value("${paypal.mode}")
    private String mode;
    
    @Value("${paypal.return.url}")
    private String returnUrl;
    
    @Value("${paypal.cancel.url}")
    private String cancelUrl;
    
    public String getClientId() {
        return clientId;
    }
    
    public String getClientSecret() {
        return clientSecret;
    }
    
    public String getMode() {
        return mode;
    }
    
    public String getReturnUrl() {
        return returnUrl;
    }
    
    public String getCancelUrl() {
        return cancelUrl;
    }
}