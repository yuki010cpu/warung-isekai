import type { Anime, AnimeDetails, PaginatedAnime, StreamData } from '../types';

// Mengganti API yang tidak stabil dengan mirror publik yang lebih andal.
const API_BASE_URL = 'https://api-consumet-org-sigma.vercel.app/anime';

// Gunakan Gogoanime untuk fitur penemuan (populer, sedang tayang).
const GOGOANIME_API_URL = `${API_BASE_URL}/gogoanime`;
// Gunakan AnimeFox untuk pencarian, detail, dan streaming.
const ANIMEFOX_API_URL = `${API_BASE_URL}/animefox`;


const fetchJson = async <T,>(url: string): Promise<T> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// --- Fitur Penemuan (dari Gogoanime) ---

export const getTopAiringAnime = async (page: number = 1): Promise<PaginatedAnime> => {
    return fetchJson<PaginatedAnime>(`${GOGOANIME_API_URL}/top-airing?page=${page}`);
};

export const getPopularAnime = async (page: number = 1): Promise<PaginatedAnime> => {
    return fetchJson<PaginatedAnime>(`${GOGOANIME_API_URL}/popular?page=${page}`);
};

// --- Fitur Inti (dari AnimeFox) ---

export const searchAnime = async (query: string, page: number = 1): Promise<PaginatedAnime> => {
    return fetchJson<PaginatedAnime>(`${ANIMEFOX_API_URL}/${encodeURIComponent(query)}?page=${page}`);
};

export const getAnimeDetails = async (id: string): Promise<AnimeDetails> => {
    const data = await fetchJson<AnimeDetails>(`${ANIMEFOX_API_URL}/info?id=${id}`);
    if (data.episodes) {
        data.episodes.sort((a, b) => a.number - b.number);
    }
    return data;
};

const extractStreamData = (data: any): StreamData => {
    if (!data.sources || data.sources.length === 0) {
        return { streamUrl: null, subtitleUrl: null };
    }
    const hlsSources = data.sources.filter((s: any) => s.url.includes('.m3u8'));
    const sourceToUse = hlsSources.length > 0 ? hlsSources : data.sources;

    const defaultSource = sourceToUse.find((s: any) => s.quality === 'default' || s.quality === 'auto');
    const firstSource = sourceToUse[0];
    const streamUrl = defaultSource ? defaultSource.url : (firstSource ? firstSource.url : null);
    
    const subtitle = data.subtitles?.find((sub: any) => sub.lang === 'English' || sub.lang.toLowerCase().includes('en'));

    return {
        streamUrl,
        subtitleUrl: subtitle ? subtitle.url : null,
    };
}

export const getStreamForEpisode = async (episodeId: string): Promise<StreamData> => {
    if (!episodeId) {
        throw new Error("ID Episode diperlukan.");
    }
    try {
        const data = await fetchJson<any>(`${ANIMEFOX_API_URL}/watch?episodeId=${episodeId}`);
        const streamData = extractStreamData(data);
        if (!streamData.streamUrl) {
            throw new Error("Tidak ada URL stream yang ditemukan dalam respons penyedia.");
        }
        return streamData;
    } catch (error) {
        console.error(`Gagal mengambil stream dari AnimeFox untuk ID episode ${episodeId}:`, error);
        throw error;
    }
};