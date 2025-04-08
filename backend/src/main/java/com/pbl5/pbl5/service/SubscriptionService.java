package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.Subscription;
import com.pbl5.pbl5.repos.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionService {
    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    public Optional<Subscription> getSubscriptionById(Integer id) {
        return subscriptionRepository.findById(id);
    }
    
    public List<Subscription> getSubscriptionsByUserId(Integer userId) {
        return subscriptionRepository.findByUserId(userId);
    }

    public Subscription createSubscription(Subscription subscription) {
        subscription.setStartDate(LocalDateTime.now().toLocalDate());
        if (subscription.getDuration() != null) {
            subscription.setEndDate(subscription.getStartDate().plusMonths(subscription.getDuration()));
        }
        return subscriptionRepository.save(subscription);
    }
    
    public Subscription updateSubscription(Integer id, Subscription subscriptionDetails) {
        return subscriptionRepository.findById(id).map(subscription -> {
            subscription.setStatus(subscriptionDetails.getStatus());
            if (subscriptionDetails.getDuration() != null) {
                subscription.setDuration(subscriptionDetails.getDuration());
                subscription.setEndDate(subscription.getStartDate().plusMonths(subscription.getDuration()));
            }
            return subscriptionRepository.save(subscription);
        }).orElse(null);
    }

    public void deleteSubscription(Integer id) {
        subscriptionRepository.deleteById(id);
    }
    
    public List<Subscription> getActiveSubscriptions() {
        return subscriptionRepository.findByEndDateAfter(LocalDateTime.now().toLocalDate());
    }
    
    public List<Subscription> getExpiredSubscriptions() {
        return subscriptionRepository.findByEndDateBefore(LocalDateTime.now().toLocalDate());
    }
}
