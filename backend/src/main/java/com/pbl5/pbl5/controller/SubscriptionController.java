package com.pbl5.pbl5.controller;

import com.pbl5.pbl5.modal.Subscription;
import com.pbl5.pbl5.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {
    @Autowired
    private SubscriptionService subscriptionService;
    
    @GetMapping
    public ResponseEntity<List<Subscription>> getAllSubscriptions() {
        List<Subscription> subscriptions = subscriptionService.getAllSubscriptions();
        return new ResponseEntity<>(subscriptions, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Subscription> getSubscriptionById(@PathVariable Integer id) {
        Optional<Subscription> subscription = subscriptionService.getSubscriptionById(id);
        return subscription.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Subscription>> getSubscriptionsByUserId(@PathVariable Integer userId) {
        List<Subscription> subscriptions = subscriptionService.getSubscriptionsByUserId(userId);
        return new ResponseEntity<>(subscriptions, HttpStatus.OK);
    }
    
    @PostMapping
    public ResponseEntity<Subscription> createSubscription(@RequestBody Subscription subscription) {
        Subscription newSubscription = subscriptionService.createSubscription(subscription);
        return new ResponseEntity<>(newSubscription, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Subscription> updateSubscription(@PathVariable Integer id, @RequestBody Subscription subscription) {
        Subscription updatedSubscription = subscriptionService.updateSubscription(id, subscription);
        if (updatedSubscription != null) {
            return new ResponseEntity<>(updatedSubscription, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Integer id) {
        subscriptionService.deleteSubscription(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
