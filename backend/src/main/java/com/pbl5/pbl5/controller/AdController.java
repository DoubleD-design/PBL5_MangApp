package com.pbl5.pbl5.controller;

import com.pbl5.pbl5.service.AdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import com.pbl5.pbl5.modal.*;

@RestController
public class AdController {
    
    @Autowired
    private AdService adService;
    
    // Admin endpoints for managing ads
    @PostMapping("/admin/ads/disable")
    public ResponseEntity<String> disableAds(@RequestParam Integer adId) {
        Ad ad = adService.disableAd(adId);
        if (ad != null) {
            return ResponseEntity.ok("Advertisement with ID " + adId + " has been disabled.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Enable advertisements
    @PostMapping("/admin/ads/enable")
    public ResponseEntity<String> enableAds(@RequestParam Integer adId) {
        Ad ad = adService.enableAd(adId);
        if (ad != null) {
            return ResponseEntity.ok("Advertisement with ID " + adId + " has been enabled.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Public endpoints for displaying ads
    @GetMapping("/api/ads/display")
    public ResponseEntity<List<Ad>> displayAds() {
        List<Ad> ads = adService.getActiveAds();
        return new ResponseEntity<>(ads, HttpStatus.OK);
    }
    
    @GetMapping("/api/ads/all")
    public ResponseEntity<List<Ad>> getAllAds() {
        List<Ad> ads = adService.getAllAds();
        return new ResponseEntity<>(ads, HttpStatus.OK);
    }
    
    @GetMapping("/api/ads/{id}")
    public ResponseEntity<Ad> getAdById(@PathVariable Integer id) {
        Optional<Ad> ad = adService.getAdById(id);
        return ad.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/api/ads")
    public ResponseEntity<Ad> createAd(@RequestBody Ad ad) {
        Ad newAd = adService.createAdWithDefaults(ad);
        return new ResponseEntity<>(newAd, HttpStatus.CREATED);
    }
    
    // Track ad impressions
    @PostMapping("/api/ads/impression")
    public ResponseEntity<Void> trackImpression(@RequestBody Map<String, Object> payload) {
        try {
            Integer adId = Integer.valueOf(payload.get("adId").toString());
            // Here you would typically save impression data to a database
            // For now, we'll just log it and ensure the ad exists
            Optional<Ad> ad = adService.getAdById(adId);
            if (ad.isPresent()) {
                System.out.println("Ad impression tracked for ad ID: " + adId);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Track ad clicks
    @PostMapping("/api/ads/click")
    public ResponseEntity<Void> trackClick(@RequestBody Map<String, Object> payload) {
        try {
            Integer adId = Integer.valueOf(payload.get("adId").toString());
            // Here you would typically save click data to a database
            // For now, we'll just log it and ensure the ad exists
            Optional<Ad> ad = adService.getAdById(adId);
            if (ad.isPresent()) {
                System.out.println("Ad click tracked for ad ID: " + adId);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
