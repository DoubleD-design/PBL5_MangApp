import { Manga, Chapter, SearchRes } from './Manga';

export type RootStackParamList = {
  MangaDetail: { manga: Manga };
  Reading: { chapter: Chapter; chapters: Chapter[] }; // thêm chapters
  SearchResults: { query: String; results: Manga[] };
};
