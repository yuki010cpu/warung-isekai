
import React from 'react';
import { Link } from 'react-router-dom';
import type { Anime } from '../types';

interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#00ffc6]/20">
      <Link to={`/anime/${anime.id}`} className="block">
        <div className="relative aspect-[2/3]">
          <img
            src={anime.image}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-3 w-full">
            <h3 className="text-white font-semibold text-base leading-tight drop-shadow-md">
              {anime.title}
            </h3>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AnimeCard;
