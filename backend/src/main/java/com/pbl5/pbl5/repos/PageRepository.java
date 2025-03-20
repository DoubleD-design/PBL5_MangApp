package com.pbl5.pbl5.repos;

import com.pbl5.pbl5.modal.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PageRepository extends JpaRepository<Page, Integer> {
    List<Page> findByChapterIdOrderByPageNumberAsc(Integer chapterId);
}

