package com.pbl5.pbl5.controller;

import com.pbl5.pbl5.modal.Favourite;
import com.pbl5.pbl5.service.FavouriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/favourites")
public class FavouriteController {
    @Autowired
    private FavouriteService favouriteService;
    
    @GetMapping
    public ResponseEntity<List<Favourite>> getAllFavourites() {
        List<Favourite> favourites = favouriteService.getAllFavourites();
        return new ResponseEntity<>(favourites, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Favourite> getFavouriteById(@PathVariable Integer id) {
        Optional<Favourite> favourite = favouriteService.getFavouriteById(id);
        return favourite.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Favourite>> getFavouritesByUserId(@PathVariable Integer userId) {
        List<Favourite> favourites = favouriteService.getFavouritesByUserId(userId);
        return new ResponseEntity<>(favourites, HttpStatus.OK);
    }
    
    @GetMapping("/manga/{mangaId}")
    public ResponseEntity<List<Favourite>> getFavouritesByMangaId(@PathVariable Integer mangaId) {
        List<Favourite> favourites = favouriteService.getFavouritesByMangaId(mangaId);
        return new ResponseEntity<>(favourites, HttpStatus.OK);
    }
    
    @PostMapping
    public ResponseEntity<Favourite> createFavourite(@RequestBody Favourite favourite) {
        Favourite newFavourite = favouriteService.createFavourite(favourite);
        return new ResponseEntity<>(newFavourite, HttpStatus.CREATED);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFavourite(@PathVariable Integer id) {
        favouriteService.deleteFavourite(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @DeleteMapping("/user/{userId}/manga/{mangaId}")
    public ResponseEntity<Void> deleteFavouriteByUserIdAndMangaId(
            @PathVariable Integer userId, 
            @PathVariable Integer mangaId) {
        favouriteService.deleteFavouriteByUserIdAndMangaId(userId, mangaId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
