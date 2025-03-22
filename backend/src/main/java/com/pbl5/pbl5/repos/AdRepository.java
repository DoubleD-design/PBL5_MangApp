package com.pbl5.pbl5.repos;

import com.pbl5.pbl5.modal.Ad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdRepository extends JpaRepository<Ad, Integer> {
    // Lấy danh sách quảng cáo mới nhất (sắp xếp theo thời gian giảm dần)
    List<Ad> findAllByOrderByCreatedAtDesc();
}
