package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.Ad;
import com.pbl5.pbl5.repos.AdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdService {
    @Autowired
    private AdRepository adRepository;

    public List<Ad> getAllAds() {
        return adRepository.findAll();
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
            ad.setImageUrl(adDetails.getImageUrl());
            ad.setLink(adDetails.getLink());
            return adRepository.save(ad);
        }).orElse(null);
    }

    public void deleteAd(Integer id) {
        adRepository.deleteById(id);
    }
}
