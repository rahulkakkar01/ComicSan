import { cache } from '../utils/cache';

const BASE_URL = "https://backend-rizr.onrender.com";

export const searchManga = async (query: string) => {
  const cacheKey = `search-${query}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(`${BASE_URL}/api/mangadex-proxy/manga?title=${encodeURIComponent(query)}&limit=24&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) throw new Error('Failed to search manga');
  const data = await response.json();
  cache.set(cacheKey, data);
  return data;
};

export const getPopularManga = async () => {
  const cacheKey = 'popular-manga';
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(`${BASE_URL}/api/mangadex-popular`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) throw new Error('Failed to fetch popular manga');
  const data = await response.json();
  cache.set(cacheKey, data);
  return data;
};

export const getManhwaList = async () => {
  const tag = "0716debc-0b16-4b81-846c-479861d5b21b";
  const url = `${BASE_URL}/api/mangadex-proxy/manga?limit=20&includedTags[]=${tag}&order[followedCount]=desc&includes[]=cover_art`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch manhwa");
  return res.json();
};

export const getMangaDetails = async (id: string) => {
  const url = `${BASE_URL}/api/mangadex-proxy/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch details");
  return res.json();
};

export const getChapters = async (mangaId: string) => {
  const url = `${BASE_URL}/api/mangadex-proxy/chapter?manga=${mangaId}&translatedLanguage[]=en&order[chapter]=asc&limit=10`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch chapters");
  return res.json();
};

export const getChapterPages = async (chapterId: string) => {
  const response = await fetch(`${BASE_URL}/api/mangadex-proxy/at-home/server/${chapterId}`);
  if (!response.ok) throw new Error('Failed to fetch chapter pages');
  return response.json();
};

export const getChapterInfo = async (chapterId: string) => {
  const response = await fetch(`${BASE_URL}/api/mangadex-proxy/chapter/${chapterId}`);
  if (!response.ok) throw new Error('Failed to fetch chapter info');
  return response.json();
};

export const getMangaChapters = async (mangaId: string) => {
  const response = await fetch(
    `${BASE_URL}/api/mangadex-proxy/manga/${mangaId}/feed?translatedLanguage[]=en&order[chapter]=asc&limit=500`
  );
  if (!response.ok) throw new Error('Failed to fetch chapters');
  return response.json();
};
