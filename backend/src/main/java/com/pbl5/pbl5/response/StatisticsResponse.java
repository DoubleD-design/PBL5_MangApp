package com.pbl5.pbl5.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class StatisticsResponse {

    // Dashboard summary statistics
    public static class DashboardSummary {
        private int vipUserCount;
        private int todayPageViews;
        private BigDecimal totalRevenue;

        public DashboardSummary() {
        }

        public DashboardSummary(int vipUserCount, int todayPageViews, BigDecimal totalRevenue) {
            this.vipUserCount = vipUserCount;
            this.todayPageViews = todayPageViews;
            this.totalRevenue = totalRevenue;
        }

        public int getVipUserCount() {
            return vipUserCount;
        }

        public void setVipUserCount(int vipUserCount) {
            this.vipUserCount = vipUserCount;
        }

        public int getTodayPageViews() {
            return todayPageViews;
        }

        public void setTodayPageViews(int todayPageViews) {
            this.todayPageViews = todayPageViews;
        }

        public BigDecimal getTotalRevenue() {
            return totalRevenue;
        }

        public void setTotalRevenue(BigDecimal totalRevenue) {
            this.totalRevenue = totalRevenue;
        }
    }
    
    // User statistics
    public static class UserStats {
        private int totalUsers;
        private int vipUsers;
        private int regularUsers;
        private List<UserGrowthItem> userGrowth;
        private Map<String, Integer> usersByGender;
        
        public UserStats() {
        }
        
        public UserStats(int totalUsers, int vipUsers, int regularUsers, 
                         List<UserGrowthItem> userGrowth, Map<String, Integer> usersByGender) {
            this.totalUsers = totalUsers;
            this.vipUsers = vipUsers;
            this.regularUsers = regularUsers;
            this.userGrowth = userGrowth;
            this.usersByGender = usersByGender;
        }
        
        public int getTotalUsers() {
            return totalUsers;
        }
        
        public void setTotalUsers(int totalUsers) {
            this.totalUsers = totalUsers;
        }
        
        public int getVipUsers() {
            return vipUsers;
        }
        
        public void setVipUsers(int vipUsers) {
            this.vipUsers = vipUsers;
        }
        
        public int getRegularUsers() {
            return regularUsers;
        }
        
        public void setRegularUsers(int regularUsers) {
            this.regularUsers = regularUsers;
        }
        
        public List<UserGrowthItem> getUserGrowth() {
            return userGrowth;
        }
        
        public void setUserGrowth(List<UserGrowthItem> userGrowth) {
            this.userGrowth = userGrowth;
        }
        
        public Map<String, Integer> getUsersByGender() {
            return usersByGender;
        }
        
        public void setUsersByGender(Map<String, Integer> usersByGender) {
            this.usersByGender = usersByGender;
        }
    }
    
    // User growth item for monthly tracking
    public static class UserGrowthItem {
        private String month;
        private int newUsers;
        private int newVipUsers;
        
        public UserGrowthItem() {
        }
        
        public UserGrowthItem(String month, int newUsers, int newVipUsers) {
            this.month = month;
            this.newUsers = newUsers;
            this.newVipUsers = newVipUsers;
        }
        
        public String getMonth() {
            return month;
        }
        
        public void setMonth(String month) {
            this.month = month;
        }
        
        public int getNewUsers() {
            return newUsers;
        }
        
        public void setNewUsers(int newUsers) {
            this.newUsers = newUsers;
        }
        
        public int getNewVipUsers() {
            return newVipUsers;
        }
        
        public void setNewVipUsers(int newVipUsers) {
            this.newVipUsers = newVipUsers;
        }
    }

    // Revenue chart data
    public static class RevenueChart {
        private List<String> labels; // Month names or date ranges
        private List<BigDecimal> revenueData;
        private List<Integer> subscriptionData;

        public RevenueChart() {
        }

        public RevenueChart(List<String> labels, List<BigDecimal> revenueData, List<Integer> subscriptionData) {
            this.labels = labels;
            this.revenueData = revenueData;
            this.subscriptionData = subscriptionData;
        }

        public List<String> getLabels() {
            return labels;
        }

        public void setLabels(List<String> labels) {
            this.labels = labels;
        }

        public List<BigDecimal> getRevenueData() {
            return revenueData;
        }

        public void setRevenueData(List<BigDecimal> revenueData) {
            this.revenueData = revenueData;
        }

        public List<Integer> getSubscriptionData() {
            return subscriptionData;
        }

        public void setSubscriptionData(List<Integer> subscriptionData) {
            this.subscriptionData = subscriptionData;
        }
    }
    
    // Payment statistics
    public static class PaymentStats {
        private BigDecimal totalRevenue;
        private int totalPayments;
        private int completedPayments;
        private int pendingPayments;
        private int failedPayments;
        private List<PaymentMethodItem> paymentsByMethod;
        private List<MonthlyPaymentItem> monthlyPayments;
        
        public PaymentStats() {
        }
        
        public PaymentStats(BigDecimal totalRevenue, int totalPayments, int completedPayments,
                           int pendingPayments, int failedPayments, List<PaymentMethodItem> paymentsByMethod,
                           List<MonthlyPaymentItem> monthlyPayments) {
            this.totalRevenue = totalRevenue;
            this.totalPayments = totalPayments;
            this.completedPayments = completedPayments;
            this.pendingPayments = pendingPayments;
            this.failedPayments = failedPayments;
            this.paymentsByMethod = paymentsByMethod;
            this.monthlyPayments = monthlyPayments;
        }
        
        public BigDecimal getTotalRevenue() {
            return totalRevenue;
        }
        
        public void setTotalRevenue(BigDecimal totalRevenue) {
            this.totalRevenue = totalRevenue;
        }
        
        public int getTotalPayments() {
            return totalPayments;
        }
        
        public void setTotalPayments(int totalPayments) {
            this.totalPayments = totalPayments;
        }
        
        public int getCompletedPayments() {
            return completedPayments;
        }
        
        public void setCompletedPayments(int completedPayments) {
            this.completedPayments = completedPayments;
        }
        
        public int getPendingPayments() {
            return pendingPayments;
        }
        
        public void setPendingPayments(int pendingPayments) {
            this.pendingPayments = pendingPayments;
        }
        
        public int getFailedPayments() {
            return failedPayments;
        }
        
        public void setFailedPayments(int failedPayments) {
            this.failedPayments = failedPayments;
        }
        
        public List<PaymentMethodItem> getPaymentsByMethod() {
            return paymentsByMethod;
        }
        
        public void setPaymentsByMethod(List<PaymentMethodItem> paymentsByMethod) {
            this.paymentsByMethod = paymentsByMethod;
        }
        
        public List<MonthlyPaymentItem> getMonthlyPayments() {
            return monthlyPayments;
        }
        
        public void setMonthlyPayments(List<MonthlyPaymentItem> monthlyPayments) {
            this.monthlyPayments = monthlyPayments;
        }
    }
    
    // Payment method breakdown
    public static class PaymentMethodItem {
        private String method;
        private int count;
        private BigDecimal amount;
        
        public PaymentMethodItem() {
        }
        
        public PaymentMethodItem(String method, int count, BigDecimal amount) {
            this.method = method;
            this.count = count;
            this.amount = amount;
        }
        
        public String getMethod() {
            return method;
        }
        
        public void setMethod(String method) {
            this.method = method;
        }
        
        public int getCount() {
            return count;
        }
        
        public void setCount(int count) {
            this.count = count;
        }
        
        public BigDecimal getAmount() {
            return amount;
        }
        
        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }
    }
    
    // Monthly payment tracking
    public static class MonthlyPaymentItem {
        private String month;
        private int count;
        private BigDecimal amount;
        
        public MonthlyPaymentItem() {
        }
        
        public MonthlyPaymentItem(String month, int count, BigDecimal amount) {
            this.month = month;
            this.count = count;
            this.amount = amount;
        }
        
        public String getMonth() {
            return month;
        }
        
        public void setMonth(String month) {
            this.month = month;
        }
        
        public int getCount() {
            return count;
        }
        
        public void setCount(int count) {
            this.count = count;
        }
        
        public BigDecimal getAmount() {
            return amount;
        }
        
        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }
    }
    
    // Subscription statistics
    public static class SubscriptionStats {
        private int totalSubscriptions;
        private int activeSubscriptions;
        private int expiredSubscriptions;
        private List<SubscriptionDurationItem> subscriptionsByDuration;
        private List<MonthlySubscriptionItem> monthlySubscriptions;
        
        public SubscriptionStats() {
        }
        
        public SubscriptionStats(int totalSubscriptions, int activeSubscriptions, int expiredSubscriptions,
                                List<SubscriptionDurationItem> subscriptionsByDuration,
                                List<MonthlySubscriptionItem> monthlySubscriptions) {
            this.totalSubscriptions = totalSubscriptions;
            this.activeSubscriptions = activeSubscriptions;
            this.expiredSubscriptions = expiredSubscriptions;
            this.subscriptionsByDuration = subscriptionsByDuration;
            this.monthlySubscriptions = monthlySubscriptions;
        }
        
        public int getTotalSubscriptions() {
            return totalSubscriptions;
        }
        
        public void setTotalSubscriptions(int totalSubscriptions) {
            this.totalSubscriptions = totalSubscriptions;
        }
        
        public int getActiveSubscriptions() {
            return activeSubscriptions;
        }
        
        public void setActiveSubscriptions(int activeSubscriptions) {
            this.activeSubscriptions = activeSubscriptions;
        }
        
        public int getExpiredSubscriptions() {
            return expiredSubscriptions;
        }
        
        public void setExpiredSubscriptions(int expiredSubscriptions) {
            this.expiredSubscriptions = expiredSubscriptions;
        }
        
        public List<SubscriptionDurationItem> getSubscriptionsByDuration() {
            return subscriptionsByDuration;
        }
        
        public void setSubscriptionsByDuration(List<SubscriptionDurationItem> subscriptionsByDuration) {
            this.subscriptionsByDuration = subscriptionsByDuration;
        }
        
        public List<MonthlySubscriptionItem> getMonthlySubscriptions() {
            return monthlySubscriptions;
        }
        
        public void setMonthlySubscriptions(List<MonthlySubscriptionItem> monthlySubscriptions) {
            this.monthlySubscriptions = monthlySubscriptions;
        }
    }
    
    // Subscription duration breakdown
    public static class SubscriptionDurationItem {
        private int durationMonths;
        private int count;
        
        public SubscriptionDurationItem() {
        }
        
        public SubscriptionDurationItem(int durationMonths, int count) {
            this.durationMonths = durationMonths;
            this.count = count;
        }
        
        public int getDurationMonths() {
            return durationMonths;
        }
        
        public void setDurationMonths(int durationMonths) {
            this.durationMonths = durationMonths;
        }
        
        public int getCount() {
            return count;
        }
        
        public void setCount(int count) {
            this.count = count;
        }
    }
    
    // Monthly subscription tracking
    public static class MonthlySubscriptionItem {
        private String month;
        private int newSubscriptions;
        private int renewals;
        
        public MonthlySubscriptionItem() {
        }
        
        public MonthlySubscriptionItem(String month, int newSubscriptions, int renewals) {
            this.month = month;
            this.newSubscriptions = newSubscriptions;
            this.renewals = renewals;
        }
        
        public String getMonth() {
            return month;
        }
        
        public void setMonth(String month) {
            this.month = month;
        }
        
        public int getNewSubscriptions() {
            return newSubscriptions;
        }
        
        public void setNewSubscriptions(int newSubscriptions) {
            this.newSubscriptions = newSubscriptions;
        }
        
        public int getRenewals() {
            return renewals;
        }
        
        public void setRenewals(int renewals) {
            this.renewals = renewals;
        }
    }

    // Top manga data
    public static class TopMangaList {
        private List<TopMangaItem> items;

        public TopMangaList() {
        }

        public TopMangaList(List<TopMangaItem> items) {
            this.items = items;
        }

        public List<TopMangaItem> getItems() {
            return items;
        }

        public void setItems(List<TopMangaItem> items) {
            this.items = items;
        }
    }

    public static class TopMangaItem {
        private Integer mangaId;
        private String title;
        private String coverImage;
        private Integer viewCount;

        public TopMangaItem() {
        }

        public TopMangaItem(Integer mangaId, String title, String coverImage, Integer viewCount) {
            this.mangaId = mangaId;
            this.title = title;
            this.coverImage = coverImage;
            this.viewCount = viewCount;
        }

        public Integer getMangaId() {
            return mangaId;
        }

        public void setMangaId(Integer mangaId) {
            this.mangaId = mangaId;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getCoverImage() {
            return coverImage;
        }

        public void setCoverImage(String coverImage) {
            this.coverImage = coverImage;
        }

        public Integer getViewCount() {
            return viewCount;
        }

        public void setViewCount(Integer viewCount) {
            this.viewCount = viewCount;
        }
    }
}