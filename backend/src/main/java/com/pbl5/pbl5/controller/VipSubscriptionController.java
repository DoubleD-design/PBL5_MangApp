package com.pbl5.pbl5.controller;

import com.pbl5.pbl5.request.VipSubscriptionRequest;
import com.pbl5.pbl5.service.PayPalService;
import com.pbl5.pbl5.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/vip-subscription")
public class VipSubscriptionController {
    
    @Autowired
    private PayPalService payPalService;
    
    @Autowired
    private UserService userService;
    
    /**
     * Creates a PayPal order for VIP subscription
     * @param request VIP subscription request containing user ID and package type
     * @return Order creation response with approval URL
     */
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@Valid @RequestBody VipSubscriptionRequest request) {
        try {
            // Validate user exists
            if (!userService.getUserById(request.getUserId()).isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            // Validate package type
            if (!"MONTHLY".equals(request.getPackageType()) && !"ANNUAL".equals(request.getPackageType())) {
                return ResponseEntity.badRequest().body("Invalid package type. Must be MONTHLY or ANNUAL");
            }
            
            // Create PayPal order
            Map<String, Object> orderResponse = payPalService.createOrder(
                    request.getUserId(), 
                    request.getPackageType()
            );
            
            return ResponseEntity.ok(orderResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating order: " + e.getMessage());
        }
    }
    
    /**
     * Captures payment for a completed order and updates user VIP status
     * @param orderId PayPal order ID
     * @return Capture response
     */
    @PostMapping("/capture-payment")
    public ResponseEntity<?> capturePayment(@RequestParam("orderId") String orderId) {
        try {
            // Validate order ID
            if (orderId == null || orderId.isEmpty()) {
                return ResponseEntity.badRequest().body("Order ID is required");
            }
            
            // Capture payment and update user VIP status
            Map<String, Object> captureResponse = payPalService.captureOrder(orderId);
            
            // Check if payment was successful
            if (captureResponse != null && "COMPLETED".equals(captureResponse.get("status"))) {
                return ResponseEntity.ok(captureResponse);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Payment capture failed or incomplete");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error capturing payment: " + e.getMessage());
        }
    }
    
    /**
     * Gets VIP status for a user
     * @param userId User ID
     * @return VIP status information
     */
    @GetMapping("/status/{userId}")
    public ResponseEntity<?> getVipStatus(@PathVariable Integer userId) {
        try {
            return userService.getUserById(userId)
                    .map(user -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("vipStatus", user.getVipStatus());
                        response.put("vipStartDate", user.getVipStartDate());
                        response.put("vipEndDate", user.getVipEndDate());
                        return ResponseEntity.ok(response);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error getting VIP status: " + e.getMessage());
        }
    }
    
    /**
     * Handles successful PayPal payment redirect
     * @param orderId PayPal order ID
     * @return Redirect to frontend success page
     */
    @GetMapping("/success")
    public ResponseEntity<?> handlePaymentSuccess(@RequestParam("token") String orderId) {
        try {
            // Capture payment when user is redirected back
            Map<String, Object> captureResponse = payPalService.captureOrder(orderId);
            
            // Create response with payment details
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Payment completed successfully");
            response.put("details", captureResponse);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing successful payment: " + e.getMessage());
        }
    }
    
    /**
     * Handles cancelled PayPal payment redirect
     * @return Redirect to frontend cancel page
     */
    @GetMapping("/cancel")
    public ResponseEntity<?> handlePaymentCancel() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "cancelled");
        response.put("message", "Payment was cancelled");
        
        return ResponseEntity.ok(response);
    }
}