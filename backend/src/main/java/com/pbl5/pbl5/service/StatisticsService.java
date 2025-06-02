package com.pbl5.pbl5.service;

import com.pbl5.pbl5.response.StatisticsResponse;

import java.time.LocalDate;

public interface StatisticsService {
    /**
     * Get dashboard summary statistics including VIP user count, today's page views, and total revenue
     * @return Dashboard summary data
     */
    StatisticsResponse.DashboardSummary getDashboardSummary();

    /**
     * Get revenue chart data for a specified date range
     * @param startDate Optional start date for filtering
     * @param endDate Optional end date for filtering
     * @return Revenue chart data including monthly revenue and subscription counts
     */
    StatisticsResponse.RevenueChart getRevenueData(LocalDate startDate, LocalDate endDate);

    /**
     * Get top manga by view count
     * @param startDate Optional start date for filtering
     * @param endDate Optional end date for filtering
     * @param limit Maximum number of manga to return (default 5)
     * @return List of top manga with view counts
     */
    StatisticsResponse.TopMangaList getTopManga(LocalDate startDate, LocalDate endDate, int limit);
    
    /**
     * Get user statistics with optional date range
     * @param startDate Optional start date for filtering
     * @param endDate Optional end date for filtering
     * @return User statistics data
     */
    StatisticsResponse.UserStats getUserStats(LocalDate startDate, LocalDate endDate);
    
    /**
     * Get payment statistics with optional date range
     * @param startDate Optional start date for filtering
     * @param endDate Optional end date for filtering
     * @return Payment statistics data
     */
    StatisticsResponse.PaymentStats getPaymentStats(LocalDate startDate, LocalDate endDate);
    
    /**
     * Get subscription statistics with optional date range
     * @param startDate Optional start date for filtering
     * @param endDate Optional end date for filtering
     * @return Subscription statistics data
     */
    StatisticsResponse.SubscriptionStats getSubscriptionStats(LocalDate startDate, LocalDate endDate);
}