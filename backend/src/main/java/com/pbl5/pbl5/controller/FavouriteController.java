package com.pbl5.pbl5.controller;

import com.pbl5.pbl5.modal.Favourite;
import com.pbl5.pbl5.modal.Manga;
import com.pbl5.pbl5.modal.User;
import com.pbl5.pbl5.request.FavouriteRequest;
import com.pbl5.pbl5.service.FavouriteService;
import com.pbl5.pbl5.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/favourites")
public class FavouriteController {
    @Autowired
    private FavouriteService favouriteService;
    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Manga>> getUserFavoriteMangas() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userService.getUserByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // User user = userRepository.findByEmail(username)
        //         .orElseThrow(() -> new RuntimeException("User not found"));

        List<Manga> mangas = favouriteService.getFavouriteMangasByUserId(user.getId());
        return new ResponseEntity<>(mangas, HttpStatus.OK);
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
    public ResponseEntity<Favourite> createFavourite(@RequestBody FavouriteRequest request) {
        // Lấy thông tin user hiện tại từ context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); // Đây là username đã login
        System.out.println(username);

        // Tìm User tương ứng
        User user = userService.getUserByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // User user = userRepository.findByEmail(username)
        //         .orElseThrow(() -> new RuntimeException("User not found"));

        Favourite favourite = new Favourite();
        favourite.setReaderId(user.getId());
        favourite.setMangaId(request.getMangaId());
        favourite.setCreatedAt(LocalDateTime.now());

        Favourite savedFavourite = favouriteService.createFavourite(favourite);
        return new ResponseEntity<>(savedFavourite, HttpStatus.CREATED);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFavourite(@PathVariable Integer id) {
        favouriteService.deleteFavourite(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @DeleteMapping("/manga/{mangaId}")
    public ResponseEntity<Void> deleteFavouriteByUserIdAndMangaId( @PathVariable Integer mangaId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userService.getUserByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // User user = userRepository.findByEmail(username)
        //         .orElseThrow(() -> new RuntimeException("User not found"));

        favouriteService.deleteFavouriteByUserIdAndMangaId(user.getId(), mangaId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
