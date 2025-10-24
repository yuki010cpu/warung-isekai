import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <h1 className="text-9xl font-bold text-[#00ffc6] opacity-30 select-none" aria-hidden="true">404</h1>
      <h2 className="text-4xl font-semibold mt-2 mb-3 text-white">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-400 max-w-sm mb-8">
        Maaf, halaman yang Anda cari tidak ada atau mungkin telah dipindahkan.
      </p>
      <Link 
        to="/"
        className="inline-block bg-[#00ffc6] text-gray-900 font-bold py-3 px-8 rounded-full text-lg transform transition-transform hover:scale-105 hover:shadow-lg hover:shadow-[#00ffc6]/30"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFoundPage;
