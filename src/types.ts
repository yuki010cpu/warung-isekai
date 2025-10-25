
export interface Anime {
  id: string;
  title: string;
  url?: string;
  image: string;
  genres?: string[];
  releaseDate?: string;
  subOrDub?: string;
  // Properti yang diperluas untuk detail
  description?: string;
  status?: string;
  type?: string;
  totalEpisodes?: number;
  episodes?: Episode[];
}

export interface Episode {
  id: string;
  number: number;
  url: string;
  title?: string;
}

// AnimeDetails sekarang menjadi alias untuk Anime yang diperluas, menyederhanakan tipe.
export type AnimeDetails = Anime;

export interface PaginatedAnime {
  currentPage: string | number;
  hasNextPage: boolean;
  results: Anime[];
}

// FIX: Add StreamData interface to resolve import error in consumetService.
export interface StreamData {
  streamUrl: string | null;
  subtitleUrl: string | null;
}

// FIX: Add missing Jikan-specific types to resolve import errors.
// Types for Jikan API
export interface JikanAnime {
  mal_id: number;
  url: string;
  images: {
    jpg: { image_url: string };
    webp: { image_url: string };
  };
  title: string;
  genres: { name: string }[];
  year: number | null;
  synopsis: string | null;
  status: string;
  type: string;
  episodes: number | null;
}

export interface JikanResponse<T> {
  data: T;
}

export interface JikanPagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface JikanSearchResponse {
  data: JikanAnime[];
  pagination: JikanPagination;
}

export interface JikanEpisode {
  mal_id: number;
  url: string;
  title: string;
}

export interface JikanEpisodesResponse {
  data: JikanEpisode[];
  pagination: JikanPagination;
}