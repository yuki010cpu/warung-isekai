
import React, { useState, useEffect } from 'react';
import { getTopAnime } from '../services/jikanService';
import type { Anime } from '../types';
import AnimeCard from '../components/AnimeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularAnime = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTopAnime();
        setPopularAnime(data);
      } catch (err) {
        setError('Gagal memuat anime populer. Coba lagi nanti.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularAnime();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-[#00ffc6]">Anime Populer Teratas</h1>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {popularAnime.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
