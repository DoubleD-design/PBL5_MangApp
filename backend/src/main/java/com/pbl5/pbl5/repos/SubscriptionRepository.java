package com.pbl5.pbl5.repos;

import com.pbl5.pbl5.modal.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Integer> {
    List<Subscription> findByUserId(Integer userId);
    List<Subscription> findByEndDateAfter(LocalDate date);
    List<Subscription> findByEndDateBefore(LocalDate date);
    List<Subscription> findByUserIdAndEndDateAfter(Integer userId, LocalDate date);
    List<Subscription> findByPaymentId(Integer paymentId);
}
