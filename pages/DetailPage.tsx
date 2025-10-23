
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAnimeDetails } from '../services/jikanService';
import { translateText } from '../services/geminiService';
import type { Anime } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import DummyPlayer from '../components/DummyPlayer';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [translatedSynopsis, setTranslatedSynopsis] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAnimeDetails(id);
        setAnime(data);

        if (data.synopsis) {
          setTranslating(true);
          const translated = await translateText(data.synopsis);
          setTranslatedSynopsis(translated);
          setTranslating(false);
        } else {
            setTranslatedSynopsis("Tidak ada sinopsis yang tersedia.");
        }
        
      } catch (err) {
        setError('Gagal memuat detail anime. Mungkin anime ini tidak ada.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!anime) {
    return <p className="text-center">Anime tidak ditemukan.</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <DummyPlayer imageUrl={anime.images.webp.large_image_url} title={anime.title} />
      </div>

      <div className="bg-gray-800/50 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 flex-shrink-0">
            <img 
              src={anime.images.webp.large_image_url} 
              alt={anime.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-3/4 space-y-4">
            <h1 className="text-4xl font-bold text-white">{anime.title}</h1>
            <div className="flex items-center space-x-4 text-gray-400">
                <span className="flex items-center space-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    <span>{anime.score || 'N/A'}</span>
                </span>
                <span>•</span>
                <span>{anime.year || 'N/A'}</span>
                 <span>•</span>
                <span>{anime.status}</span>
                <span>•</span>
                <span>{anime.episodes ? `${anime.episodes} episode` : 'N/A'}</span>
            </div>
             <div className="flex flex-wrap gap-2">
                {anime.genres.map(genre => (
                    <span key={genre.mal_id} className="bg-[#00ffc6]/20 text-[#00ffc6] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {genre.name}
                    </span>
                ))}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2 text-[#00ffc6]">Sinopsis</h2>
              {translating ? (
                 <p className="text-gray-400 animate-pulse">Menerjemahkan...</p>
              ) : (
                <p className="text-gray-300 leading-relaxed">{translatedSynopsis}</p>
              )}
            </div>
            
            <div className="pt-4">
                <a 
                    href="#" 
                    className="inline-block bg-[#00ffc6] text-gray-900 font-bold py-3 px-8 rounded-full text-lg transform transition-transform hover:scale-105 hover:shadow-lg hover:shadow-[#00ffc6]/30">
                    Tonton Sekarang
                </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
