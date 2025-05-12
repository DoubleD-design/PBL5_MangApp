package com.pbl5.pbl5.service;

import com.pbl5.pbl5.config.PayPalConfig;
import com.pbl5.pbl5.modal.Payment;
import com.pbl5.pbl5.modal.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class PayPalService {
    
    @Autowired
    private PayPalConfig payPalConfig;
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PaymentService paymentService;
    
    private static final String MONTHLY_PACKAGE_PRICE = "1.25";
    private static final String ANNUAL_PACKAGE_PRICE = "12.50";
    private static final String PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com";
    
    /**
     * Creates a PayPal order for VIP subscription
     * @param userId User ID for the subscription
     * @param packageType "MONTHLY" or "ANNUAL"
     * @return Order creation response containing approval URL
     */
    public Map<String, Object> createOrder(Integer userId, String packageType) {
        String accessToken = getAccessToken();
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> orderRequest = new HashMap<>();
        
        // Set intent to CAPTURE for immediate payment capture
        orderRequest.put("intent", "CAPTURE");
        
        // Add custom_id with userId for later reference
        Map<String, String> applicationContext = new HashMap<>();
        applicationContext.put("return_url", payPalConfig.getReturnUrl());
        applicationContext.put("cancel_url", payPalConfig.getCancelUrl());
        applicationContext.put("user_action", "PAY_NOW");
        applicationContext.put("custom_id", userId.toString());
        orderRequest.put("application_context", applicationContext);
        
        // Set purchase details
        Map<String, Object> purchaseUnit = new HashMap<>();
        Map<String, Object> amount = new HashMap<>();
        
        // Set amount based on package type
        amount.put("currency_code", "USD");
        if ("MONTHLY".equals(packageType)) {
            amount.put("value", MONTHLY_PACKAGE_PRICE);
        } else {
            amount.put("value", ANNUAL_PACKAGE_PRICE);
        }
        
        purchaseUnit.put("amount", amount);
        purchaseUnit.put("description", packageType + " VIP Subscription");
        
        // Add reference_id with userId for tracking
        purchaseUnit.put("reference_id", userId.toString());
        
        orderRequest.put("purchase_units", new Object[]{purchaseUnit});
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(orderRequest, headers);
        
        ResponseEntity<Map> response = restTemplate.exchange(
                PAYPAL_API_BASE + "/v2/checkout/orders",
                HttpMethod.POST,
                entity,
                Map.class
        );
        
        return response.getBody();
    }
    
    /**
     * Captures payment for a completed order and updates user VIP status
     * @param orderId PayPal order ID
     * @return Capture response
     */
    public Map<String, Object> captureOrder(String orderId) {
        String accessToken = getAccessToken();
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<String> entity = new HttpEntity<>("", headers);
        
        ResponseEntity<Map> response = restTemplate.exchange(
                PAYPAL_API_BASE + "/v2/checkout/orders/" + orderId + "/capture",
                HttpMethod.POST,
                entity,
                Map.class
        );
        
        Map<String, Object> captureResponse = response.getBody();
        
        // Process successful payment
        if (captureResponse != null && "COMPLETED".equals(captureResponse.get("status"))) {
            // Extract user ID from custom_id
            Map<String, Object> purchaseUnit = ((java.util.List<Map<String, Object>>) captureResponse.get("purchase_units")).get(0);
            String userId = (String) purchaseUnit.get("reference_id");
            
            // Extract amount
            Map<String, Object> payments = (Map<String, Object>) purchaseUnit.get("payments");
            Map<String, Object> captures = (Map<String, Object>) ((java.util.List<Map<String, Object>>) payments.get("captures")).get(0);
            Map<String, Object> amount = (Map<String, Object>) captures.get("amount");
            String value = (String) amount.get("value");
            
            // Determine package type based on amount
            boolean isAnnual = ANNUAL_PACKAGE_PRICE.equals(value);
            
            // Update user VIP status
            updateUserVipStatus(Integer.parseInt(userId), isAnnual);
            
            // Create payment record
            createPaymentRecord(Integer.parseInt(userId), new BigDecimal(value), orderId);
        }
        
        return captureResponse;
    }
    
    /**
     * Updates user's VIP status based on the subscription package
     * @param userId User ID
     * @param isAnnual Whether the package is annual or monthly
     */
    private void updateUserVipStatus(Integer userId, boolean isAnnual) {
        User user = userService.getUserById(userId).orElseThrow(() -> 
                new RuntimeException("User not found with ID: " + userId));
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endDate;
        
        if (isAnnual) {
            endDate = now.plusMonths(12);
        } else {
            endDate = now.plusMonths(1);
        }
        
        user.setVipStatus(true);
        user.setVipStartDate(now);
        user.setVipEndDate(endDate);
        
        userService.updateUser(user);
    }
    
    /**
     * Creates a payment record for the subscription
     * @param userId User ID
     * @param amount Payment amount
     * @param orderId PayPal order ID
     */
    private void createPaymentRecord(Integer userId, BigDecimal amount, String orderId) {
        Payment payment = new Payment();
        payment.setReaderId(userId);
        payment.setAmount(amount);
        payment.setPaymentMethod("PayPal");
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setCreatedAt(LocalDateTime.now());
        
        paymentService.createPayment(payment);
    }
    
    /**
     * Gets PayPal access token for API authentication
     * @return Access token
     */
    private String getAccessToken() {
        String auth = payPalConfig.getClientId() + ":" + payPalConfig.getClientSecret();
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + encodedAuth);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        
        HttpEntity<String> entity = new HttpEntity<>("grant_type=client_credentials", headers);
        
        ResponseEntity<Map> response = restTemplate.exchange(
                PAYPAL_API_BASE + "/v1/oauth2/token",
                HttpMethod.POST,
                entity,
                Map.class
        );
        
        Map<String, Object> tokenResponse = response.getBody();
        return (String) tokenResponse.get("access_token");
    }
}