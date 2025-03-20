package com.pbl5.pbl5.repos;

import com.pbl5.pbl5.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.lang.NonNull;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(@NonNull String username);
    Optional<User> findByEmail(@NonNull String email);
    Optional<User> findByUsernameOrEmail(@NonNull String username, @NonNull String email);
    boolean existsByEmail(@NonNull String email);
    boolean existsByUsername(@NonNull String username);
    List<User> findByVipStatusTrue();

    // Cập nhật VIP status cho người dùng
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.vipStatus = :vipStatus WHERE u.id = :userId")
    void updateVipStatus(@Param("userId") @NonNull Integer userId, @Param("vipStatus") @NonNull Boolean vipStatus);

    // Xóa người dùng theo ID
    void deleteById(@NonNull Integer id);

    // Đếm số lượng người dùng
    long count();
}

