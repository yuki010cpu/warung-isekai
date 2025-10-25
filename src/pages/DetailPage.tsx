import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAnimeDetails, getAnimeEpisodes } from '../services/jikanService';
import { translateText } from '../services/geminiService';
import type { AnimeDetails, Episode } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EpisodeList from '../components/EpisodeList';
import DummyPlayer from '../components/DummyPlayer';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  const [translatedSynopsis, setTranslatedSynopsis] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Ambil detail dan episode secara paralel
        const [detailsData, episodesData] = await Promise.all([
            getAnimeDetails(id),
            getAnimeEpisodes(id)
        ]);

        setAnime(detailsData);
        setEpisodes(episodesData);

        if (detailsData.description) {
          translateText(detailsData.description).then(setTranslatedSynopsis);
        } else {
          setTranslatedSynopsis("Tidak ada sinopsis yang tersedia.");
        }
        
        if (episodesData.length > 0) {
          // Pilih episode pertama secara default
          setSelectedEpisode(episodesData[0]);
        }
        
      } catch (err) {
        if (err instanceof Error) {
          setError(`Gagal memuat detail anime: ${err.message}`);
        } else {
          setError('Gagal memuat detail anime. Mungkin anime ini tidak ada.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const handleSelectEpisode = (episode: Episode) => {
      setSelectedEpisode(episode);
      // Di masa mendatang, ini bisa menautkan ke URL eksternal episode jika diinginkan
      // window.open(episode.url, '_blank');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!anime) return <p className="text-center">Anime tidak ditemukan.</p>;

  return (
    <div className="space-y-8">
      <DummyPlayer />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-gray-800/50 p-6 rounded-lg">
             <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 flex-shrink-0">
                  <img src={anime.image} alt={anime.title} className="w-full rounded-lg shadow-lg"/>
                </div>
                <div className="md:w-3/4 space-y-4">
                  <h1 className="text-4xl font-bold text-white">{anime.title}</h1>
                   <div className="flex items-center space-x-4 text-gray-400 flex-wrap">
                      <span>{anime.releaseDate || 'N/A'}</span>
                      <span>•</span><span>{anime.status}</span>
                      <span>•</span><span>{anime.totalEpisodes ? `${anime.totalEpisodes} episode` : 'N/A'}</span>
                       <span>•</span><span>{anime.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">{(anime.genres || []).map(genre => (<span key={genre} className="bg-[#00ffc6]/20 text-[#00ffc6] text-xs font-semibold px-2.5 py-0.5 rounded-full">{genre}</span>))}</div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-[#00ffc6]">Sinopsis</h2>
                    <p className="text-gray-300 leading-relaxed">{translatedSynopsis}</p>
                  </div>
                </div>
             </div>
           </div>
        </div>
        <div className="lg:col-span-1">
            <EpisodeList 
                episodes={episodes}
                activeEpisodeNumber={selectedEpisode?.number}
                onSelectEpisode={handleSelectEpisode}
            />
        </div>
      </div>
    </div>
  );
};

export default DetailPage;