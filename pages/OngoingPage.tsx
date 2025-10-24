
import React, { useState, useEffect } from 'react';
import { getTopAiringAnime } from '../services/jikanService';
import type { Anime } from '../types';
import AnimeCard from '../components/AnimeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const OngoingPage: React.FC = () => {
  const [airingAnime, setAiringAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAiringAnime = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTopAiringAnime(); // Ambil daftar lengkap
        setAiringAnime(data);
      } catch (err) {
        setError('Gagal memuat anime yang sedang tayang.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAiringAnime();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-[#00ffc6]">Anime Sedang Tayang</h1>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && !error && (
        <>
          {airingAnime.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {airingAnime.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 mt-8">
              Tidak ada anime yang sedang tayang ditemukan.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default OngoingPage;
