package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.Ad;
import com.pbl5.pbl5.repos.AdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AdService {
    @Autowired
    private AdRepository adRepository;

    public List<Ad> getAllAds() {
        return adRepository.findAll();
    }
    
    public List<Ad> getActiveAds() {
        return adRepository.findByIsActiveTrue();
    }

    public Optional<Ad> getAdById(Integer id) {
        return adRepository.findById(id);
    }

    public Ad createAd(Ad ad) {
        return adRepository.save(ad);
    }

    public Ad updateAd(Integer id, Ad adDetails) {
        return adRepository.findById(id).map(ad -> {
            ad.setTitle(adDetails.getTitle());
            ad.setDescription(adDetails.getDescription());
            ad.setImageUrl(adDetails.getImageUrl());
            ad.setLink(adDetails.getLink());
            ad.setCallToAction(adDetails.getCallToAction());
            return adRepository.save(ad);
        }).orElse(null);
    }

    public void deleteAd(Integer id) {
        adRepository.deleteById(id);
    }
    
    public Ad disableAd(Integer id) {
        return adRepository.findById(id).map(ad -> {
            ad.setIsActive(false);
            return adRepository.save(ad);
        }).orElse(null);
    }
    
    public Ad enableAd(Integer id) {
        return adRepository.findById(id).map(ad -> {
            ad.setIsActive(true);
            return adRepository.save(ad);
        }).orElse(null);
    }
    
    public Ad createAdWithDefaults(Ad ad) {
        if (ad.getCreatedAt() == null) {
            ad.setCreatedAt(LocalDateTime.now());
        }
        if (ad.getIsActive() == null) {
            ad.setIsActive(true);
        }
        return adRepository.save(ad);
    }
}
