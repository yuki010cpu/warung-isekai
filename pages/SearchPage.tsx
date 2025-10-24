
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchAnime } from '../services/jikanService';
import type { Anime } from '../types';
import AnimeCard from '../components/AnimeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await searchAnime(query);
        setSearchResults(data);
      } catch (err) {
        setError('Gagal melakukan pencarian. Coba lagi nanti.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Hasil Pencarian untuk: <span className="text-[#00ffc6]">{query}</span>
      </h1>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && !error && (
        <>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {searchResults.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 mt-8">
              Tidak ada hasil yang ditemukan untuk "{query}".
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
