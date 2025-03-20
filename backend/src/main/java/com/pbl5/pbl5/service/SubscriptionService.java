package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.Subscription;
import com.pbl5.pbl5.repos.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Subscription createSubscription(Subscription subscription) {
        return subscriptionRepository.save(subscription);
    }

    public void deleteSubscription(Integer id) {
        subscriptionRepository.deleteById(id);
    }
}
