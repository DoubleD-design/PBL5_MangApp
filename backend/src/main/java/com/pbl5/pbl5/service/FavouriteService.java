package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.Favourite;
import com.pbl5.pbl5.modal.Manga;
import com.pbl5.pbl5.repos.FavouriteRepository;
import com.pbl5.pbl5.repos.MangaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class FavouriteService {
    @Autowired
    private FavouriteRepository favouriteRepository;
    @Autowired
    private MangaRepository mangaRepository;

    public List<Favourite> getAllFavourites() {
        return favouriteRepository.findAll();
    }

    public Optional<Favourite> getFavouriteById(Integer id) {
        return favouriteRepository.findById(id);
    }
    
    public List<Favourite> getFavouritesByUserId(Integer userId) {
        return favouriteRepository.findByUserId(userId);
    }
    
    public List<Favourite> getFavouritesByMangaId(Integer mangaId) {
        return favouriteRepository.findByMangaId(mangaId);
    }

    @Transactional
    public Favourite createFavourite(Favourite favourite) {
        favourite.setCreatedAt(LocalDateTime.now());
        return favouriteRepository.save(favourite);
    }

    @Transactional
    public void deleteFavourite(Integer id) {
        favouriteRepository.deleteById(id);
    }
    
    @Transactional
    public void deleteFavouriteByUserIdAndMangaId(Integer userId, Integer mangaId) {
        favouriteRepository.deleteByUserIdAndMangaId(userId, mangaId);
    }
    
    public boolean existsByUserIdAndMangaId(Integer userId, Integer mangaId) {
        return favouriteRepository.existsByUserIdAndMangaId(userId, mangaId);
    }
    public List<Manga> getFavouriteMangasByUserId(Integer userId) {
        List<Favourite> favourites = favouriteRepository.findByUserId(userId);
        List<Integer> mangaIds = favourites.stream()
                .map(Favourite::getMangaId)
                .collect(Collectors.toList());
        
        // Use a separate query to fetch mangas by IDs without eager loading collections
        // This avoids the MultipleBagFetchException by not fetching multiple collections at once
        List<Manga> mangas = new ArrayList<>(mangaRepository.findAllById(mangaIds));
        
        // Sort mangas to maintain consistent order
        mangas.sort(Comparator.comparing(Manga::getId));
        
        return mangas;
    }
}
