package com.pbl5.pbl5.service;
import com.pbl5.pbl5.modal.Category;
import com.pbl5.pbl5.modal.Rating;
import com.pbl5.pbl5.modal.Chapter;
import com.pbl5.pbl5.modal.Manga;
import com.pbl5.pbl5.repos.*;
import com.pbl5.pbl5.request.MangaRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class MangaService {

    private final PageRepository pageRepository;
    @Autowired
    private MangaRepository mangaRepository;
    @Autowired
    private FavouriteRepository favouriteRepository;
    @Autowired
    private AzureBlobService azureBlobService;
    @Autowired
    private com.pbl5.pbl5.repos.CategoryRepository categoryRepository;
    @Autowired
    private ReadingHistoryRepository readingHistoryRepository;
    @Autowired
    private ChapterRepository chapterRepository;
    MangaService(PageRepository pageRepository) {
        this.pageRepository = pageRepository;
    }
    @Cacheable("mangas")
    // public List<Manga> getAllMangas() {
    //     // Use findAllWithChapters to eagerly fetch chapters and avoid LazyInitializationException
    //     return mangaRepository.findAllWithChapters();
    // }
    public List<Manga> getAllMangas() {
        return mangaRepository.findAllWithCategories();
    }

    @Cacheable(value = "mangaById", key = "#id")
    public Optional<Manga> getMangaById(Integer id) {
        // Get the basic manga entity first
        Optional<Manga> mangaOpt = mangaRepository.findByIdWithAllRelations(id);
        
        if (mangaOpt.isPresent()) {
            // Load each collection separately to avoid MultipleBagFetchException
            mangaRepository.findByIdWithCategories(id);
            mangaRepository.findByIdWithChapters(id);
            mangaRepository.findByIdWithRatings(id);
            mangaRepository.findByIdWithComments(id);
            mangaRepository.findByIdWithFavourites(id);
            mangaRepository.findByIdWithReadingHistories(id);
        }
        
        return mangaOpt;
    }
    
    @Cacheable(value = "mangaWithCategories", key = "#id")
    public Optional<Manga> getMangaWithCategories(Integer id) {
        return mangaRepository.findByIdWithCategories(id);
    }
    
    @Cacheable(value = "mangaWithChapters", key = "#id")
    public Optional<Manga> getMangaWithChapters(Integer id) {
        return mangaRepository.findByIdWithChapters(id);
    }

    @Transactional
    @CacheEvict(value = {"mangas", "mangaById", "mangaWithCategories", "mangaWithChapters"}, key = "#id")
    public Manga updateManga(Integer id, Manga mangaDetails) {
        return mangaRepository.findById(id).map(manga -> {
            manga.setTitle(mangaDetails.getTitle());
            manga.setCategories(mangaDetails.getCategories());
            manga.setAuthor(mangaDetails.getAuthor());
            return mangaRepository.save(manga);
        }).orElse(null);
    }

    @Transactional
    @CacheEvict(value = {"mangas", "mangaById", "mangaWithCategories", "mangaWithChapters"}, key = "#id")
    public void deleteManga(Integer id) {
        favouriteRepository.deleteByMangaId(id);
        readingHistoryRepository.deleteByMangaId(id);
        List<Chapter> chapters  = chapterRepository.findByMangaId(id);
        for (Chapter chapter : chapters) {
            pageRepository.deleteByChapterId(chapter.getId());
        }
        chapterRepository.deleteByMangaId(id);
        mangaRepository.deleteById(id);
    }

    public List<Manga> searchByTitle(String keyword) {
        return mangaRepository.searchByTitle(keyword);
    }
    
    public List<Manga> searchByAuthor(String keyword) {
        return mangaRepository.findByAuthorContainingIgnoreCase(keyword);
    }
    
    public List<Manga> searchByAll(String keyword) {
        // Get results from title search
        List<Manga> titleResults = mangaRepository.searchByTitle(keyword);
        
        // Get results from author search
        List<Manga> authorResults = mangaRepository.findByAuthorContainingIgnoreCase(keyword);
        
        // Combine results (avoiding duplicates)
        java.util.Set<Manga> combinedResults = new java.util.HashSet<>();
        combinedResults.addAll(titleResults);
        combinedResults.addAll(authorResults);
        
        // Add description search (still using stream since we don't have a repository method for this)
        mangaRepository.findAll().stream()
            .filter(manga -> manga.getDescription() != null && 
                    manga.getDescription().toLowerCase().contains(keyword.toLowerCase()))
            .forEach(combinedResults::add);
            
        return new java.util.ArrayList<>(combinedResults);
    }
    
    public List<Manga> getFeaturedMangas() {
        // Fetch all mangas with their ratings eagerly loaded
        List<Manga> allMangas = mangaRepository.findAllWithRatings();
        
        // Process mangas with ratings already initialized
        return allMangas.stream()
            .filter(manga -> manga.getRatings() != null && !manga.getRatings().isEmpty())
            .sorted((m1, m2) -> {
                double avg1 = m1.getRatings().stream().mapToDouble(Rating::getRating).average().orElse(0.0);
                double avg2 = m2.getRatings().stream().mapToDouble(Rating::getRating).average().orElse(0.0);
                return Double.compare(avg2, avg1);
            })
            .limit(10)
            .toList();
    }
    
    public List<Manga> getLatestUpdates() {
        // Fetch all mangas with their chapters eagerly loaded
        List<Manga> allMangas = mangaRepository.findAllWithChapters();
        
        // Process mangas with chapters already initialized
        return allMangas.stream()
            .filter(manga -> manga.getChapters() != null && !manga.getChapters().isEmpty())
            .sorted((m1, m2) -> {
                LocalDateTime latest1 = m1.getChapters().stream()
                    .map(Chapter::getCreatedAt)
                    .max(LocalDateTime::compareTo)
                    .orElse(LocalDateTime.MIN);
                LocalDateTime latest2 = m2.getChapters().stream()
                    .map(Chapter::getCreatedAt)
                    .max(LocalDateTime::compareTo)
                    .orElse(LocalDateTime.MIN);
                return latest2.compareTo(latest1);
            })
            .toList();
    }
    
    @Transactional
    @CacheEvict(value = {"mangaById", "mangas"}, key = "#id")
    public Manga incrementViews(Integer id) {
        return mangaRepository.findById(id).map(manga -> {
            Integer currentViews = manga.getViews();
            manga.setViews(currentViews == null ? 1 : currentViews + 1);
            System.out.println("Incrementing views for manga ID: " + id + " from " + currentViews + " to " + manga.getViews());
            Manga savedManga = mangaRepository.save(manga);
            System.out.println("Saved manga with views: " + savedManga.getViews());
            return savedManga;
        }).orElse(null);
    }
    
    public List<Manga> getMostViewedMangas(int limit) {
        return mangaRepository.findAll().stream()
            .sorted((m1, m2) -> {
                Integer views1 = m1.getViews() == null ? 0 : m1.getViews();
                Integer views2 = m2.getViews() == null ? 0 : m2.getViews();
                return views2.compareTo(views1); // Sort in descending order
            })
            .limit(limit)
            .toList();
    }

    public List<Manga> findByCategoriesId(Integer categoryId, Pageable pageable) {
        if (categoryId == null) {
            throw new IllegalArgumentException("Category ID cannot be null");
        }
        return mangaRepository.findByCategoriesId(categoryId, pageable);
    }
    @Transactional
    public Manga uploadAndSave(MangaRequestDTO dto, MultipartFile image, Integer adminId, boolean isUpdate, Integer mangaId) {
        String imageUrl = dto.getCoverImage();
        Manga manga;

        if (isUpdate && mangaId != null) {
            manga = mangaRepository.findById(mangaId).orElseThrow(() -> new RuntimeException("Manga not found"));
        } else {
            manga = new Manga();
            manga.setCreatedAt(java.time.LocalDateTime.now());
        }

        // Upload cover image if provided
        if (image != null && !image.isEmpty()) {
            imageUrl = azureBlobService.uploadCoverImage(manga.getId() != null ? manga.getId().toString() : UUID.randomUUID().toString(), image);
        }

        manga.setTitle(dto.getTitle());
        manga.setDescription(dto.getDescription());
        manga.setCoverImage(imageUrl);
        manga.setAuthor(dto.getAuthor());
        manga.setAdminId(adminId);
        manga.setStatus(Manga.MangaStatus.valueOf(dto.getStatus()));

        // Set categories
        Set<Category> categories = new HashSet<>(categoryRepository.findAllById(dto.getCategoryIds()));
        manga.setCategories(categories);

        return mangaRepository.save(manga);
    }
    @Transactional
    public Manga updateManga(Integer id, MangaRequestDTO dto, MultipartFile image) {
        return mangaRepository.findById(id).map(manga -> {
            // Update manga details
            manga.setTitle(dto.getTitle());
            manga.setDescription(dto.getDescription());
            manga.setAuthor(dto.getAuthor());
            manga.setStatus(Manga.MangaStatus.valueOf(dto.getStatus()));

            // Upload new cover image if provided
            if (image != null && !image.isEmpty()) {
                String coverImageUrl = azureBlobService.uploadCoverImage(String.valueOf(id), image);
                manga.setCoverImage(coverImageUrl);
            }

            // Update categories
            List<Category> categories = categoryRepository.findAllById(dto.getCategoryIds());
            manga.setCategories((Set<Category>) categories);

            return mangaRepository.save(manga);
        }).orElseThrow(() -> new RuntimeException("Manga not found with id: " + id));
    }

}
