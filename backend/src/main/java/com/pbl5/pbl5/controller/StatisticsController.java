package com.pbl5.pbl5.controller;

import com.pbl5.pbl5.response.StatisticsResponse;
import com.pbl5.pbl5.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/statistics")
@CrossOrigin(origins = "*")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<StatisticsResponse.DashboardSummary> getDashboardSummary() {
        return ResponseEntity.ok(statisticsService.getDashboardSummary());
    }

    @GetMapping("/revenue")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<StatisticsResponse.RevenueChart> getRevenueData(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(statisticsService.getRevenueData(startDate, endDate));
    }

    @GetMapping("/top-manga")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<StatisticsResponse.TopMangaList> getTopManga(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(statisticsService.getTopManga(startDate, endDate, limit));
    }
    
    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<StatisticsResponse.UserStats> getUserStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(statisticsService.getUserStats(startDate, endDate));
    }
    
    @GetMapping("/payments")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<StatisticsResponse.PaymentStats> getPaymentStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(statisticsService.getPaymentStats(startDate, endDate));
    }
    
    @GetMapping("/subscriptions")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<StatisticsResponse.SubscriptionStats> getSubscriptionStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(statisticsService.getSubscriptionStats(startDate, endDate));
    }
}