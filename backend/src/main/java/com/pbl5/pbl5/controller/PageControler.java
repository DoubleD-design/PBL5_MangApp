package com.pbl5.pbl5.controller;

import com.pbl5.pbl5.modal.Page;
import com.pbl5.pbl5.service.PageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pages")
public class PageControler {
    @Autowired
    private PageService pageService;
    
    @GetMapping
    public ResponseEntity<List<Page>> getAllPages() {
        List<Page> pages = pageService.getAllPages();
        return new ResponseEntity<>(pages, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Page> getPageById(@PathVariable Integer id) {
        Optional<Page> page = pageService.getPageById(id);
        return page.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<List<Page>> getPagesByChapterId(@PathVariable Integer chapterId) {
        List<Page> pages = pageService.getPagesByChapterId(chapterId);
        return new ResponseEntity<>(pages, HttpStatus.OK);
    }
    
    @PostMapping
    public ResponseEntity<Page> createPage(@RequestBody Page page) {
        Page newPage = pageService.createPage(page);
        return new ResponseEntity<>(newPage, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Page> updatePage(@PathVariable Integer id, @RequestBody Page page) {
        Page updatedPage = pageService.updatePage(id, page);
        if (updatedPage != null) {
            return new ResponseEntity<>(updatedPage, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePage(@PathVariable Integer id) {
        pageService.deletePage(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
