
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-[#00ffc6] animate-pulse" style={{ textShadow: '0 0 10px #00ffc6, 0 0 20px #00ffc6' }}>
          ENIM TOD
        </h1>
        <p className="text-gray-400 mt-2">Memuat dunia wibu...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
