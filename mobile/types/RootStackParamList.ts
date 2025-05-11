import { Manga, Chapter } from './Manga';

export type RootStackParamList = {
  MangaDetail: { manga: Manga };
  Reading: { chapter: Chapter; chapters: Chapter[] }; // thêm chapters
};
