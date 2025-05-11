package com.pbl5.pbl5.repos;

import com.pbl5.pbl5.modal.Ad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdRepository extends JpaRepository<Ad, Integer> {
    // Get the latest ads (ordered by creation time descending)
    List<Ad> findAllByOrderByCreatedAtDesc();
    
    // Get only active ads
    
    List<Ad> findByIsActiveTrue();
}
