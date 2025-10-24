
import React, { useState, useEffect } from 'react';
import { getAnimeList } from '../services/jikanService';
import type { Anime } from '../types';
import AnimeCard from '../components/AnimeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const AnimeListPage: React.FC = () => {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    const fetchAnime = async () => {
      window.scrollTo(0, 0); // Gulir ke atas saat halaman berubah
      try {
        setLoading(true);
        setError(null);
        const response = await getAnimeList(currentPage);
        setAnime(response.results);
        setHasNextPage(response.hasNextPage);
      } catch (err) {
        setError('Gagal memuat daftar anime.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [currentPage]);

  const handleNextPage = () => {
    if (hasNextPage) {
        setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => (prev > 1 ? prev - 1 : 1));
  };


  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-[#00ffc6]">Daftar Anime Populer</h1>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <>
          {anime.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {anime.map((item) => (
                <AnimeCard key={item.id} anime={item} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 mt-8">
              Tidak ada anime yang ditemukan.
            </p>
          )}

          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1 || loading}
              className="bg-[#00ffc6] text-gray-900 font-bold py-2 px-6 rounded-full transition-colors hover:bg-white disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <span className="text-lg font-semibold">{currentPage}</span>
            <button
              onClick={handleNextPage}
              disabled={!hasNextPage || loading}
              className="bg-[#00ffc6] text-gray-900 font-bold py-2 px-6 rounded-full transition-colors hover:bg-white disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Selanjutnya
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AnimeListPage;
