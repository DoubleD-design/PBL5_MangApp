package com.pbl5.pbl5.repos;


import com.pbl5.pbl5.modal.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByReaderId(Integer readerId);
    List<Payment> findByStatus(Payment.PaymentStatus status);
}