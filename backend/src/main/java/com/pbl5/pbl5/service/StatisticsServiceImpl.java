package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.Manga;
import com.pbl5.pbl5.modal.Payment;
import com.pbl5.pbl5.modal.ReadingHistory;
import com.pbl5.pbl5.modal.Subscription;
import com.pbl5.pbl5.modal.User;
import com.pbl5.pbl5.repos.MangaRepository;
import com.pbl5.pbl5.repos.PaymentRepository;
import com.pbl5.pbl5.repos.ReadingHistoryRepository;
import com.pbl5.pbl5.repos.StatisticsRepository;
import com.pbl5.pbl5.repos.SubscriptionRepository;
import com.pbl5.pbl5.repos.UserRepository;
import com.pbl5.pbl5.response.StatisticsResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticsServiceImpl implements StatisticsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ReadingHistoryRepository readingHistoryRepository;

    @Autowired
    private MangaRepository mangaRepository;
    
    @Autowired
    private StatisticsRepository statisticsRepository;
    
    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Override
    public StatisticsResponse.DashboardSummary getDashboardSummary() {
        // Count VIP users
        int vipUserCount = userRepository.findByVipStatusTrue().size();

        // Count today's page views using optimized query
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        
        int todayPageViews = statisticsRepository.countPageViewsBetweenDates(startOfDay, endOfDay);

        // Calculate total revenue from completed payments using optimized query
        BigDecimal totalRevenue = statisticsRepository.calculateTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        return new StatisticsResponse.DashboardSummary(vipUserCount, todayPageViews, totalRevenue);
    }

    @Override
    public StatisticsResponse.RevenueChart getRevenueData(LocalDate startDate, LocalDate endDate) {
        // Default to current year if dates not provided
        if (startDate == null) {
            startDate = LocalDate.now().withMonth(1).withDayOfMonth(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        // Get monthly revenue data using optimized query
        List<Object[]> monthlyRevenueData = statisticsRepository.calculateMonthlyRevenue(startDateTime, endDateTime);
        
        // Get monthly new VIP subscriptions using optimized query
        List<Object[]> monthlySubscriptionData = statisticsRepository.countMonthlyNewVipSubscriptions(startDateTime, endDateTime);

        // Generate month labels between start and end date
        List<YearMonth> months = new ArrayList<>();
        YearMonth currentMonth = YearMonth.from(startDate);
        YearMonth endMonth = YearMonth.from(endDate);

        while (!currentMonth.isAfter(endMonth)) {
            months.add(currentMonth);
            currentMonth = currentMonth.plusMonths(1);
        }

        // Format month labels
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM yyyy");
        List<String> labels = months.stream()
                .map(month -> month.format(monthFormatter))
                .collect(Collectors.toList());

        // Convert query results to maps for easier lookup
        Map<Integer, BigDecimal> revenueByMonth = new HashMap<>();
        for (Object[] row : monthlyRevenueData) {
            Integer month = (Integer) row[0];
            BigDecimal revenue = (BigDecimal) row[1];
            revenueByMonth.put(month, revenue);
        }

        Map<Integer, Long> subscriptionsByMonth = new HashMap<>();
        for (Object[] row : monthlySubscriptionData) {
            Integer month = (Integer) row[0];
            Long count = (Long) row[1];
            subscriptionsByMonth.put(month, count);
        }

        // Populate revenue and subscription data for each month
        List<BigDecimal> revenueData = new ArrayList<>();
        List<Integer> subscriptionData = new ArrayList<>();

        for (YearMonth month : months) {
            int monthValue = month.getMonthValue();
            revenueData.add(revenueByMonth.getOrDefault(monthValue, BigDecimal.ZERO));
            subscriptionData.add(subscriptionsByMonth.getOrDefault(monthValue, 0L).intValue());
        }

        return new StatisticsResponse.RevenueChart(labels, revenueData, subscriptionData);
    }

    @Override
    public StatisticsResponse.TopMangaList getTopManga(LocalDate startDate, LocalDate endDate, int limit) {
        // Default to all-time if dates not provided
        LocalDateTime startDateTime;
        LocalDateTime endDateTime;
        
        if (startDate != null && endDate != null) {
            startDateTime = startDate.atStartOfDay();
            endDateTime = endDate.atTime(LocalTime.MAX);
        } else {
            // Use a very old start date and current date as end date for all-time stats
            startDateTime = LocalDateTime.of(2000, 1, 1, 0, 0);
            endDateTime = LocalDateTime.now();
        }
        
        // Get top manga by view count using optimized query
        List<Object[]> topMangaData = statisticsRepository.findTopMangaByViewCount(startDateTime, endDateTime, limit);
        
        // Get manga details for top manga
        List<StatisticsResponse.TopMangaItem> topMangaItems = new ArrayList<>();
        for (Object[] row : topMangaData) {
            Integer mangaId = (Integer) row[0];
            Long viewCount = (Long) row[1];
            
            Optional<Manga> mangaOpt = mangaRepository.findById(mangaId);
            if (mangaOpt.isPresent()) {
                Manga manga = mangaOpt.get();
                topMangaItems.add(new StatisticsResponse.TopMangaItem(
                        manga.getId(),
                        manga.getTitle(),
                        manga.getCoverImage(),
                        viewCount.intValue() // Use the count from the query
                ));
            }
        }

        return new StatisticsResponse.TopMangaList(topMangaItems);
    }
    
    @Override
    public StatisticsResponse.UserStats getUserStats(LocalDate startDate, LocalDate endDate) {
        // Default to current year if dates not provided
        LocalDateTime startDateTime;
        LocalDateTime endDateTime;
        
        if (startDate != null && endDate != null) {
            startDateTime = startDate.atStartOfDay();
            endDateTime = endDate.atTime(LocalTime.MAX);
        } else {
            startDateTime = LocalDateTime.of(LocalDate.now().withMonth(1).withDayOfMonth(1), LocalTime.MIN);
            endDateTime = LocalDateTime.now();
        }
        
        // Get user counts
        int totalUsers = statisticsRepository.countTotalUsers();
        int vipUsers = statisticsRepository.countVipUsers();
        int regularUsers = totalUsers - vipUsers;
        
        // Get user gender distribution
        List<Object[]> genderData = statisticsRepository.countUsersByGender();
        Map<String, Integer> usersByGender = new HashMap<>();
        for (Object[] row : genderData) {
            String gender = (String) row[0];
            if (gender == null) gender = "Unknown";
            Long count = (Long) row[1];
            usersByGender.put(gender, count.intValue());
        }
        
        // Get monthly user growth
        List<Object[]> newUsersData = statisticsRepository.countMonthlyNewUsers(startDateTime, endDateTime);
        List<Object[]> newVipUsersData = statisticsRepository.countMonthlyNewVipSubscriptions(startDateTime, endDateTime);
        
        // Generate month labels between start and end date
        List<YearMonth> months = new ArrayList<>();
        YearMonth currentMonth = YearMonth.from(startDateTime.toLocalDate());
        YearMonth endMonth = YearMonth.from(endDateTime.toLocalDate());
        
        while (!currentMonth.isAfter(endMonth)) {
            months.add(currentMonth);
            currentMonth = currentMonth.plusMonths(1);
        }
        
        // Convert query results to maps for easier lookup
        Map<Integer, Long> newUsersByMonth = new HashMap<>();
        for (Object[] row : newUsersData) {
            Integer month = (Integer) row[0];
            Long count = (Long) row[1];
            newUsersByMonth.put(month, count);
        }
        
        Map<Integer, Long> newVipUsersByMonth = new HashMap<>();
        for (Object[] row : newVipUsersData) {
            Integer month = (Integer) row[0];
            Long count = (Long) row[1];
            newVipUsersByMonth.put(month, count);
        }
        
        // Format month labels and populate user growth data
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM yyyy");
        List<StatisticsResponse.UserGrowthItem> userGrowth = new ArrayList<>();
        
        for (YearMonth month : months) {
            int monthValue = month.getMonthValue();
            String monthLabel = month.format(monthFormatter);
            int newUsers = newUsersByMonth.getOrDefault(monthValue, 0L).intValue();
            int newVipUsers = newVipUsersByMonth.getOrDefault(monthValue, 0L).intValue();
            
            userGrowth.add(new StatisticsResponse.UserGrowthItem(monthLabel, newUsers, newVipUsers));
        }
        
        return new StatisticsResponse.UserStats(totalUsers, vipUsers, regularUsers, userGrowth, usersByGender);
    }
    
    @Override
    public StatisticsResponse.PaymentStats getPaymentStats(LocalDate startDate, LocalDate endDate) {
        // Default to current year if dates not provided
        LocalDateTime startDateTime;
        LocalDateTime endDateTime;
        
        if (startDate != null && endDate != null) {
            startDateTime = startDate.atStartOfDay();
            endDateTime = endDate.atTime(LocalTime.MAX);
        } else {
            startDateTime = LocalDateTime.of(LocalDate.now().withMonth(1).withDayOfMonth(1), LocalTime.MIN);
            endDateTime = LocalDateTime.now();
        }
        
        // Get payment counts
        int totalPayments = statisticsRepository.countTotalPayments();
        BigDecimal totalRevenue = statisticsRepository.calculateTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }
        
        // Get payment status counts
        List<Object[]> statusData = statisticsRepository.countPaymentsByStatus();
        int completedPayments = 0;
        int pendingPayments = 0;
        int failedPayments = 0;
        
        for (Object[] row : statusData) {
            Payment.PaymentStatus status = (Payment.PaymentStatus) row[0];
            Long count = (Long) row[1];
            
            if (status == Payment.PaymentStatus.COMPLETED) {
                completedPayments = count.intValue();
            } else if (status == Payment.PaymentStatus.PENDING) {
                pendingPayments = count.intValue();
            } else if (status == Payment.PaymentStatus.FAILED) {
                failedPayments = count.intValue();
            }
        }
        
        // Get payment method breakdown
        List<Object[]> methodData = statisticsRepository.countPaymentsByMethod();
        List<StatisticsResponse.PaymentMethodItem> paymentsByMethod = new ArrayList<>();
        
        for (Object[] row : methodData) {
            String method = (String) row[0];
            Long count = (Long) row[1];
            BigDecimal amount = (BigDecimal) row[2];
            if (amount == null) amount = BigDecimal.ZERO;
            
            paymentsByMethod.add(new StatisticsResponse.PaymentMethodItem(method, count.intValue(), amount));
        }
        
        // Get monthly payment data
        List<Object[]> monthlyData = statisticsRepository.countMonthlyPayments(startDateTime, endDateTime);
        
        // Generate month labels between start and end date
        List<YearMonth> months = new ArrayList<>();
        YearMonth currentMonth = YearMonth.from(startDateTime.toLocalDate());
        YearMonth endMonth = YearMonth.from(endDateTime.toLocalDate());
        
        while (!currentMonth.isAfter(endMonth)) {
            months.add(currentMonth);
            currentMonth = currentMonth.plusMonths(1);
        }
        
        // Convert query results to maps for easier lookup
        Map<Integer, Object[]> paymentsByMonth = new HashMap<>();
        for (Object[] row : monthlyData) {
            Integer month = (Integer) row[0];
            paymentsByMonth.put(month, row);
        }
        
        // Format month labels and populate monthly payment data
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM yyyy");
        List<StatisticsResponse.MonthlyPaymentItem> monthlyPayments = new ArrayList<>();
        
        for (YearMonth month : months) {
            int monthValue = month.getMonthValue();
            String monthLabel = month.format(monthFormatter);
            
            Object[] data = paymentsByMonth.get(monthValue);
            int count = 0;
            BigDecimal amount = BigDecimal.ZERO;
            
            if (data != null) {
                count = ((Long) data[1]).intValue();
                amount = (BigDecimal) data[2];
                if (amount == null) amount = BigDecimal.ZERO;
            }
            
            monthlyPayments.add(new StatisticsResponse.MonthlyPaymentItem(monthLabel, count, amount));
        }
        
        return new StatisticsResponse.PaymentStats(
                totalRevenue, totalPayments, completedPayments, pendingPayments, failedPayments,
                paymentsByMethod, monthlyPayments);
    }
    
    @Override
    public StatisticsResponse.SubscriptionStats getSubscriptionStats(LocalDate startDate, LocalDate endDate) {
        // Default to current year if dates not provided
        LocalDateTime startDateTime;
        LocalDateTime endDateTime;
        
        if (startDate != null && endDate != null) {
            startDateTime = startDate.atStartOfDay();
            endDateTime = endDate.atTime(LocalTime.MAX);
        } else {
            startDateTime = LocalDateTime.of(LocalDate.now().withMonth(1).withDayOfMonth(1), LocalTime.MIN);
            endDateTime = LocalDateTime.now();
        }
        
        // Get subscription counts
        int totalSubscriptions = statisticsRepository.countTotalSubscriptions();
        int activeSubscriptions = statisticsRepository.countActiveSubscriptions();
        int expiredSubscriptions = statisticsRepository.countExpiredSubscriptions();
        
        // Get subscription duration breakdown
        List<Object[]> durationData = statisticsRepository.countSubscriptionsByDuration();
        List<StatisticsResponse.SubscriptionDurationItem> subscriptionsByDuration = new ArrayList<>();
        
        for (Object[] row : durationData) {
            Integer duration = (Integer) row[0];
            Long count = (Long) row[1];
            
            subscriptionsByDuration.add(new StatisticsResponse.SubscriptionDurationItem(
                    duration, count.intValue()));
        }
        
        // Get monthly new subscription data
        List<Object[]> monthlyNewData = statisticsRepository.countMonthlyNewSubscriptions(startDateTime, endDateTime);
        
        // Generate month labels between start and end date
        List<YearMonth> months = new ArrayList<>();
        YearMonth currentMonth = YearMonth.from(startDateTime.toLocalDate());
        YearMonth endMonth = YearMonth.from(endDateTime.toLocalDate());
        
        while (!currentMonth.isAfter(endMonth)) {
            months.add(currentMonth);
            currentMonth = currentMonth.plusMonths(1);
        }
        
        // Convert query results to maps for easier lookup
        Map<Integer, Long> newSubscriptionsByMonth = new HashMap<>();
        for (Object[] row : monthlyNewData) {
            Integer month = (Integer) row[0];
            Long count = (Long) row[1];
            newSubscriptionsByMonth.put(month, count);
        }
        
        // Format month labels and populate monthly subscription data
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM yyyy");
        List<StatisticsResponse.MonthlySubscriptionItem> monthlySubscriptions = new ArrayList<>();
        
        for (YearMonth month : months) {
            int monthValue = month.getMonthValue();
            String monthLabel = month.format(monthFormatter);
            
            int newSubscriptions = newSubscriptionsByMonth.getOrDefault(monthValue, 0L).intValue();
            // For renewals, we would need additional data tracking, setting to 0 for now
            int renewals = 0;
            
            monthlySubscriptions.add(new StatisticsResponse.MonthlySubscriptionItem(
                    monthLabel, newSubscriptions, renewals));
        }
        
        return new StatisticsResponse.SubscriptionStats(
                totalSubscriptions, activeSubscriptions, expiredSubscriptions,
                subscriptionsByDuration, monthlySubscriptions);
    }
}