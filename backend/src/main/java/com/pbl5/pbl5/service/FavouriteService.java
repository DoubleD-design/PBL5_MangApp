package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.Favourite;
import com.pbl5.pbl5.repos.FavouriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FavouriteService {
    @Autowired
    private FavouriteRepository favouriteRepository;

    public List<Favourite> getAllFavourites() {
        return favouriteRepository.findAll();
    }

    public Optional<Favourite> getFavouriteById(Integer id) {
        return favouriteRepository.findById(id);
    }

    public Favourite createFavourite(Favourite favourite) {
        return favouriteRepository.save(favourite);
    }

    public void deleteFavourite(Integer id) {
        favouriteRepository.deleteById(id);
    }
}
