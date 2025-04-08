package com.pbl5.pbl5.service;

import com.pbl5.pbl5.modal.Page;
import com.pbl5.pbl5.repos.PageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PageService {
    @Autowired
    private PageRepository pageRepository;

    public List<Page> getAllPages() {
        return pageRepository.findAll();
    }

    public Optional<Page> getPageById(Integer id) {
        return pageRepository.findById(id);
    }
    
    public List<Page> getPagesByChapterId(Integer chapterId) {
        return pageRepository.findByChapterIdOrderByPageNumberAsc(chapterId);
    }

    public Page createPage(Page page) {
        return pageRepository.save(page);
    }
    
    public Page updatePage(Integer id, Page pageDetails) {
        return pageRepository.findById(id).map(page -> {
            page.setImageUrl(pageDetails.getImageUrl());
            page.setPageNumber(pageDetails.getPageNumber());
            page.setChapter(pageDetails.getChapter());
            return pageRepository.save(page);
        }).orElse(null);
    }

    public void deletePage(Integer id) {
        pageRepository.deleteById(id);
    }
}
