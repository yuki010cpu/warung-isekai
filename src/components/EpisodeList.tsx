
import React from 'react';
import type { Episode } from '../types';

interface EpisodeListProps {
  episodes: Episode[];
  activeEpisodeNumber?: number | null;
  onSelectEpisode: (episode: Episode) => void;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ episodes, activeEpisodeNumber, onSelectEpisode }) => {
  if (episodes.length === 0) {
    return (
        <div className="bg-gray-800/50 p-4 rounded-lg text-center">
            <p className="text-gray-400">Tidak ada episode yang ditemukan.</p>
        </div>
    )
  }
    
  return (
    <div className="bg-gray-800/50 rounded-lg h-[600px] flex flex-col">
        <h2 className="text-xl font-bold text-white p-4 border-b border-gray-700/50 flex-shrink-0">
            Daftar Episode
        </h2>
        <div className="overflow-y-auto flex-grow scrollbar-thin">
            <div className="divide-y divide-gray-700/50">
                {episodes.map((episode) => {
                    const episodeNumber = episode.number;
                    return (
                        <button
                            key={episode.id}
                            onClick={() => onSelectEpisode(episode)}
                            className={`w-full text-left p-4 transition-colors duration-200 ${
                                activeEpisodeNumber === episodeNumber
                                    ? 'bg-[#00ffc6]/20 text-[#00ffc6]'
                                    : 'text-gray-300 hover:bg-gray-700/50'
                            }`}
                        >
                            <span className="font-semibold">Episode {episodeNumber}:</span> {episode.title || `Episode ${episodeNumber}`}
                        </button>
                    )
                })}
            </div>
        </div>
         <style>{`
            .scrollbar-thin::-webkit-scrollbar { width: 8px; }
            .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
            .scrollbar-thin::-webkit-scrollbar-thumb { background-color: #374151; border-radius: 20px; }
            .scrollbar-thin::-webkit-scrollbar-thumb:hover { background-color: #4b5563; }
        `}</style>
    </div>
  );
};

export default EpisodeList;