export type Page = {
  id: number;
  chapterId: number; 
  imageUrl: string;
  pageNumber: number;
}

export type Chapter = {
  id: number;
  mangaId: number;
  title: string;
  chapterNumber: number;
  createdAt: string;
  pages: Page[];
}

export type Category = {
  id: number;
  name: string;
};

export interface Manga {
  id: number;
  createAt: string;
  author: string;
  status: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  views: number;
  coverImage: string;
  categories: Category[];
  chapters: Chapter[];
}

export interface SearchRes {
  totalItems: number;
  totalPages: number;
  currentPages: number;
  content: Manga[];
}
