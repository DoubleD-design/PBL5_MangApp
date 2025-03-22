package com.pbl5.pbl5.repos;

import com.pbl5.pbl5.modal.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    // Tìm danh mục theo tên (dùng Optional để tránh NullPointerException)
    Optional<Category> findByName(String name);
}