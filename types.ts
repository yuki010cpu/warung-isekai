
export interface JikanImage {
  jpg: {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  };
  webp: {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  };
}

export interface Anime {
  mal_id: number;
  url: string;
  images: JikanImage;
  title: string;
  title_english: string;
  title_japanese: string;
  synopsis: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  genres: { mal_id: number; name: string }[];
  studios: { mal_id: number; name: string }[];
  rating: string;
  status: string;
  episodes: number;
  duration: string;
  year: number;
  trailer: {
    youtube_id: string;
    url: string;
    embed_url: string;
  }
}

export interface JikanResponse<T> {
  data: T;
}

export interface JikanSearchResponse {
    data: Anime[];
    pagination: {
        last_visible_page: number;
        has_next_page: boolean;
        current_page: number;
        items: {
            count: number;
            total: number;
            per_page: number;
        }
    }
}
