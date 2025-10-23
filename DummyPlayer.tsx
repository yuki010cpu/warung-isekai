
import React from 'react';

interface DummyPlayerProps {
  imageUrl: string;
  title: string;
}

const DummyPlayer: React.FC<DummyPlayerProps> = ({ imageUrl, title }) => {
  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg shadow-black/50 group">
      <img src={imageUrl} alt={`Poster for ${title}`} className="w-full h-full object-cover opacity-50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <a href="#" className="transform transition-transform duration-300 group-hover:scale-110">
          <div className="w-24 h-24 bg-[#00ffc6]/80 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-[#00ffc6]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-black" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        </a>
      </div>
      <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
        <h2 className="text-xl font-bold text-white">Menonton: {title}</h2>
      </div>
    </div>
  );
};

export default DummyPlayer;
