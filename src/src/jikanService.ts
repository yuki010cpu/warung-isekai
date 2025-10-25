
import type { Anime, PaginatedAnime, Episode, JikanResponse, JikanSearchResponse, JikanEpisodesResponse, JikanAnime, JikanEpisode } from '../types';

const API_BASE_URL = 'https://api.jikan.moe/v4';

const fetchWithRateLimit = async <T,>(url: string): Promise<T> => {
  // Jikan API memiliki batas laju 3 permintaan per detik.
  // Penundaan sederhana membantu mencegah mencapai batas selama navigasi cepat.
  await new Promise(resolve => setTimeout(resolve, 400));
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Mapper yang diperluas untuk mengubah respons Jikan menjadi tipe Anime internal aplikasi.
const jikanAnimeToAnime = (jikanAnime: JikanAnime): Anime => ({
  id: jikanAnime.mal_id.toString(),
  title: jikanAnime.title,
  image: jikanAnime.images.jpg.image_url,
  url: jikanAnime.url,
  genres: jikanAnime.genres.map(g => g.name),
  releaseDate: jikanAnime.year?.toString(),
  description: jikanAnime.synopsis || "Tidak ada sinopsis.",
  status: jikanAnime.status,
  type: jikanAnime.type,
  totalEpisodes: jikanAnime.episodes || 0,
});

// Mapper untuk mengubah data episode Jikan
const jikanEpisodeToEpisode = (jikanEpisode: JikanEpisode, index: number): Episode => ({
    id: jikanEpisode.mal_id.toString(),
    number: index + 1, // Jikan API tidak selalu menyediakan nomor episode, jadi kita gunakan indeks
    title: jikanEpisode.title,
    url: jikanEpisode.url,
});

export const getTopAnime = async (): Promise<Anime[]> => {
  const response = await fetchWithRateLimit<JikanSearchResponse>(`${API_BASE_URL}/top/anime?filter=bypopularity&limit=24`);
  return response.data.map(jikanAnimeToAnime);
};

export const getTopAiringAnime = async (limit: number = 24): Promise<Anime[]> => {
  const response = await fetchWithRateLimit<JikanSearchResponse>(`${API_BASE_URL}/top/anime?filter=airing&limit=${limit}`);
  return response.data.map(jikanAnimeToAnime);
};

export const searchAnime = async (query: string): Promise<Anime[]> => {
  const response = await fetchWithRateLimit<JikanSearchResponse>(`${API_BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=24`);
  return response.data.map(jikanAnimeToAnime);
};

export const getAnimeDetails = async (id: string): Promise<Anime> => {
  const response = await fetchWithRateLimit<JikanResponse<JikanAnime>>(`${API_BASE_URL}/anime/${id}/full`);
  return jikanAnimeToAnime(response.data);
};

export const getAnimeEpisodes = async (id: string): Promise<Episode[]> => {
    // Catatan: Jikan dapat mempaginasi episode. Untuk kesederhanaan, kita hanya akan mengambil halaman pertama (hingga 100 episode).
    const response = await fetchWithRateLimit<JikanEpisodesResponse>(`${API_BASE_URL}/anime/${id}/episodes?page=1`);
    return response.data.map(jikanEpisodeToEpisode);
}

export const getAnimeList = async (page: number = 1): Promise<PaginatedAnime> => {
  const response = await fetchWithRateLimit<JikanSearchResponse>(`${API_BASE_URL}/anime?page=${page}&limit=24&order_by=popularity`);
  return {
    currentPage: response.pagination.current_page,
    hasNextPage: response.pagination.has_next_page,
    results: response.data.map(jikanAnimeToAnime),
  };
};