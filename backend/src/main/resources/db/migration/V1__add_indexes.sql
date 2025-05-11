-- Add indexes to improve query performance

-- Manga table indexes
CREATE INDEX IF NOT EXISTS idx_manga_title ON mangas(title);
CREATE INDEX IF NOT EXISTS idx_manga_author ON mangas(author);
CREATE INDEX IF NOT EXISTS idx_manga_status ON mangas(status);
CREATE INDEX IF NOT EXISTS idx_manga_views ON mangas(views);

-- User table indexes
CREATE INDEX IF NOT EXISTS idx_user_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_role ON users(role);

-- Comment table indexes
CREATE INDEX IF NOT EXISTS idx_comment_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_manga_id ON comments(manga_id);
CREATE INDEX IF NOT EXISTS idx_comment_created_at ON comments(created_at);

-- Chapter table indexes
CREATE INDEX IF NOT EXISTS idx_chapter_manga_id ON chapters(manga_id);
CREATE INDEX IF NOT EXISTS idx_chapter_number ON chapters(chapter_number);

-- Many-to-many relationship indexes
CREATE INDEX IF NOT EXISTS idx_manga_categories_manga_id ON manga_categories(manga_id);
CREATE INDEX IF NOT EXISTS idx_manga_categories_category_id ON manga_categories(category_id);

-- Reading history indexes
CREATE INDEX IF NOT EXISTS idx_reading_history_user_id ON reading_histories(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_history_manga_id ON reading_histories(manga_id);
CREATE INDEX IF NOT EXISTS idx_reading_history_chapter_id ON reading_histories(chapter_id);

-- Favourite table indexes
CREATE INDEX IF NOT EXISTS idx_favourite_user_id ON favourites(user_id);
CREATE INDEX IF NOT EXISTS idx_favourite_manga_id ON favourites(manga_id);