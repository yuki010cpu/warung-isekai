
import React, { useState, useEffect } from 'react';
import { getTopAnime, getTopAiringAnime } from '../services/jikanService';
import type { Anime } from '../types';
import AnimeCard from '../components/AnimeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [errorPopular, setErrorPopular] = useState<string | null>(null);
  
  const [airingAnime, setAiringAnime] = useState<Anime[]>([]);
  const [loadingAiring, setLoadingAiring] = useState(true);
  const [errorAiring, setErrorAiring] = useState<string | null>(null);


  useEffect(() => {
    const fetchAnimeLists = async () => {
      // Fetch Airing Anime
      try {
        setLoadingAiring(true);
        setErrorAiring(null);
        const airingData = await getTopAiringAnime(15); // Batasi hingga 15 untuk gulir horizontal
        setAiringAnime(airingData);
      } catch (err) {
        setErrorAiring('Gagal memuat anime yang sedang tayang.');
        console.error(err);
      } finally {
        setLoadingAiring(false);
      }
      
      // Fetch Popular Anime
      try {
        setLoadingPopular(true);
        setErrorPopular(null);
        const popularData = await getTopAnime();
        setPopularAnime(popularData);
      } catch (err) {
        setErrorPopular('Gagal memuat anime populer. Coba lagi nanti.');
        console.error(err);
      } finally {
        setLoadingPopular(false);
      }
    };

    fetchAnimeLists();
  }, []);

  return (
    <div className="space-y-12">
      {/* ONGOING ANIME SECTION */}
      <div>
        <h1 className="text-3xl font-bold mb-6 text-[#00ffc6]">Sedang Tayang</h1>
        {loadingAiring && <LoadingSpinner />}
        {errorAiring && <p className="text-red-500 text-center">{errorAiring}</p>}
        {!loadingAiring && !errorAiring && (
          <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-thin">
            {airingAnime.map((anime) => (
              <div key={anime.id} className="w-40 md:w-48 lg:w-56 flex-shrink-0">
                 <AnimeCard anime={anime} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* POPULAR ANIME SECTION */}
      <div>
        <h1 className="text-3xl font-bold mb-6 text-[#00ffc6]">Anime Populer Teratas</h1>
        {loadingPopular && <LoadingSpinner />}
        {errorPopular && <p className="text-red-500 text-center">{errorPopular}</p>}
        {!loadingPopular && !errorPopular && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        )}
      </div>
      <style>{`
        /* Simple scrollbar styling for webkit browsers */
        .scrollbar-thin::-webkit-scrollbar {
            height: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: #374151; /* bg-gray-700 */
            border-radius: 20px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background-color: #4b5563; /* bg-gray-600 */
        }
      `}</style>
    </div>
  );
};

export default HomePage;
