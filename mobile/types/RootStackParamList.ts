import { Manga, Chapter, SearchRes } from './Manga';

export type RootStackParamList = {
  Home: undefined;
  MangaDetail: { manga: Manga };
  Reading: { chapter: Chapter; chapters: Chapter[] }; // thêm chapters
  SearchResults: { query: String; results: Manga[] };
  CategoryMangaList: {
    categoryId: number
    title: string
  }
};
