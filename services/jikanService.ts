
import type { Anime, JikanResponse, JikanSearchResponse } from '../types';

const API_BASE_URL = 'https://api.jikan.moe/v4';

const fetchWithRateLimit = async <T,>(url: string): Promise<T> => {
  // Jikan API has a rate limit of 3 requests per second.
  // A simple delay helps prevent hitting the limit during rapid navigation.
  await new Promise(resolve => setTimeout(resolve, 400));
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getTopAnime = async (): Promise<Anime[]> => {
  const response = await fetchWithRateLimit<JikanSearchResponse>(`${API_BASE_URL}/top/anime?filter=bypopularity&limit=24`);
  return response.data;
};

export const searchAnime = async (query: string): Promise<Anime[]> => {
  const response = await fetchWithRateLimit<JikanSearchResponse>(`${API_BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=24`);
  return response.data;
};

export const getAnimeDetails = async (id: string): Promise<Anime> => {
  const response = await fetchWithRateLimit<JikanResponse<Anime>>(`${API_BASE_URL}/anime/${id}/full`);
  return response.data;
};
