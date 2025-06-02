package com.pbl5.pbl5.repos;

import com.pbl5.pbl5.modal.Payment;
import com.pbl5.pbl5.modal.ReadingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface StatisticsRepository extends JpaRepository<Payment, Integer> {
    
    /**
     * Count the number of reading history entries updated within a time range
     */
    @Query("SELECT COUNT(rh) FROM ReadingHistory rh WHERE rh.updatedAt BETWEEN :startDate AND :endDate")
    int countPageViewsBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Calculate total revenue from completed payments
     */
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED'")
    BigDecimal calculateTotalRevenue();
    
    /**
     * Calculate monthly revenue for a given year
     */
    @Query("SELECT FUNCTION('MONTH', p.createdAt) as month, SUM(p.amount) as revenue " +
           "FROM Payment p " +
           "WHERE p.status = 'COMPLETED' " +
           "AND p.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY FUNCTION('MONTH', p.createdAt) " +
           "ORDER BY month")
    List<Object[]> calculateMonthlyRevenue(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Count new VIP subscriptions by month
     */
    @Query("SELECT FUNCTION('MONTH', u.vipStartDate) as month, COUNT(u) as count " +
           "FROM User u " +
           "WHERE u.vipStatus = true " +
           "AND u.vipStartDate BETWEEN :startDate AND :endDate " +
           "GROUP BY FUNCTION('MONTH', u.vipStartDate) " +
           "ORDER BY month")
    List<Object[]> countMonthlyNewVipSubscriptions(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Get top manga by view count
     */
    @Query("SELECT rh.mangaId, COUNT(rh) as viewCount " +
           "FROM ReadingHistory rh " +
           "WHERE rh.updatedAt BETWEEN :startDate AND :endDate " +
           "GROUP BY rh.mangaId " +
           "ORDER BY viewCount DESC " +
           "LIMIT :limit")
    List<Object[]> findTopMangaByViewCount(@Param("startDate") LocalDateTime startDate, 
                                         @Param("endDate") LocalDateTime endDate, 
                                         @Param("limit") int limit);
    
    /**
     * Count total users
     */
    @Query("SELECT COUNT(u) FROM User u")
    int countTotalUsers();
    
    /**
     * Count VIP users
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.vipStatus = true")
    int countVipUsers();
    
    /**
     * Count users by gender
     */
    @Query("SELECT u.gender, COUNT(u) FROM User u GROUP BY u.gender")
    List<Object[]> countUsersByGender();
    
    /**
     * Count new users by month in date range
     */
    @Query("SELECT FUNCTION('MONTH', u.createdAt) as month, COUNT(u) as count " +
           "FROM User u " +
           "WHERE u.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY FUNCTION('MONTH', u.createdAt) " +
           "ORDER BY month")
    List<Object[]> countMonthlyNewUsers(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Count total payments
     */
    @Query("SELECT COUNT(p) FROM Payment p")
    int countTotalPayments();
    
    /**
     * Count payments by status
     */
    @Query("SELECT p.status, COUNT(p) FROM Payment p GROUP BY p.status")
    List<Object[]> countPaymentsByStatus();
    
    /**
     * Count payments by payment method
     */
    @Query("SELECT p.paymentMethod, COUNT(p), SUM(p.amount) FROM Payment p GROUP BY p.paymentMethod")
    List<Object[]> countPaymentsByMethod();
    
    /**
     * Count monthly payments in date range
     */
    @Query("SELECT FUNCTION('MONTH', p.createdAt) as month, COUNT(p) as count, SUM(p.amount) as amount " +
           "FROM Payment p " +
           "WHERE p.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY FUNCTION('MONTH', p.createdAt) " +
           "ORDER BY month")
    List<Object[]> countMonthlyPayments(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Count total subscriptions
     */
    @Query("SELECT COUNT(s) FROM Subscription s")
    int countTotalSubscriptions();
    
    /**
     * Count active subscriptions
     */
    @Query("SELECT COUNT(s) FROM Subscription s WHERE s.endDate >= CURRENT_DATE")
    int countActiveSubscriptions();
    
    /**
     * Count expired subscriptions
     */
    @Query("SELECT COUNT(s) FROM Subscription s WHERE s.endDate < CURRENT_DATE")
    int countExpiredSubscriptions();
    
    /**
     * Count subscriptions by duration
     */
    @Query("SELECT s.duration, COUNT(s) FROM Subscription s GROUP BY s.duration ORDER BY s.duration")
    List<Object[]> countSubscriptionsByDuration();
    
    /**
     * Count monthly new subscriptions in date range
     */
    @Query("SELECT FUNCTION('MONTH', s.startDate) as month, COUNT(s) as count " +
           "FROM Subscription s " +
           "WHERE s.startDate BETWEEN :startDate AND :endDate " +
           "GROUP BY FUNCTION('MONTH', s.startDate) " +
           "ORDER BY month")
    List<Object[]> countMonthlyNewSubscriptions(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

}