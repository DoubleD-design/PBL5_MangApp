package com.pbl5.pbl5.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    // Display payments
    @GetMapping("/display")
    public String displayPayments() {
        // Logic to display payments
        return "Payments are displayed.";
    }

    // Create a new payment
    @PostMapping("/create")
    public String createPayment(@RequestParam Long userId, @RequestParam Double amount) {
        // Logic to create a new payment
        return "Payment of amount " + amount + " has been created for user with ID " + userId + ".";
    }

    // Update a payment
    @PutMapping("/update")
    public String updatePayment(@RequestParam Long paymentId, @RequestParam Double amount) {
        // Logic to update a payment
        return "Payment with ID " + paymentId + " has been updated with new amount: " + amount + ".";
    }

    // Delete a payment
    @DeleteMapping("/delete")
    public String deletePayment(@RequestParam Long paymentId) {
        // Logic to delete a payment
        return "Payment with ID " + paymentId + " has been deleted.";
    }
}
