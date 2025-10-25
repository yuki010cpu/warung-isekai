
import React, { useState, useEffect } from 'react';
// FIX: Updated to react-router-dom v6. Replaced Switch with Routes.
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from "./src/pages/HomePage";
import SearchPage from './src/pages/SearchPage';
import DetailPage from './src/pages/DetailPage';
import LoadingScreen from './components/LoadingScreen';
import NotFoundPage from './src/pages/NotFoundPage';
import OngoingPage from './src/pages/OngoingPage';
import AnimeListPage from './src/pages/AnimeListPage';

const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2000); // Simulate loading for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isAppLoading) {
    return <LoadingScreen />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {/* FIX: Replaced Switch with Routes and component prop with element for react-router-dom v6 compatibility. */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/anime/:id" element={<DetailPage />} />
            <Route path="/ongoing" element={<OngoingPage />} />
            <Route path="/list" element={<AnimeListPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

// About page component
const AboutPage: React.FC = () => (
  <div className="max-w-4xl mx-auto text-gray-300 leading-relaxed">
    <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-[#00ffc6]">
      Tentang ENIM TOD
    </h1>

    <div className="space-y-8 bg-gray-800/50 p-6 md:p-8 rounded-lg">
      <section>
        <h2 className="text-2xl font-semibold mb-3 text-white">Selamat Datang di ENIM TOD</h2>
        <p>
          ENIM TOD lahir dari kecintaan kami terhadap dunia anime dan keinginan untuk menciptakan sebuah platform yang tidak hanya fungsional, tetapi juga indah dan nyaman digunakan. Proyek ini adalah wujud dedikasi kami untuk memberikan pengalaman terbaik bagi para penggemar anime dalam menjelajahi, menemukan, dan mendapatkan informasi tentang judul-judul favorit mereka.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3 text-white">Misi Kami</h2>
        <p>
          Misi kami sederhana: menyediakan antarmuka yang bersih, cepat, dan intuitif untuk mengakses database anime yang luas. Kami percaya bahwa mencari anime baru atau melihat detail tentang seri yang sedang berlangsung harus menjadi pengalaman yang menyenangkan, bukan membingungkan. Kami fokus pada desain yang elegan dengan tema gelap untuk mengurangi ketegangan mata, sehingga Anda bisa lebih lama menikmati waktu Anda di sini.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3 text-white">Teknologi di Balik Layar</h2>
        <p>
          ENIM TOD dibangun menggunakan teknologi web modern untuk memastikan performa yang responsif dan andal. Untuk data anime, kami mengandalkan <a href="https://jikan.moe" target="_blank" rel="noopener noreferrer" className="text-[#00ffc6] hover:underline">Jikan API</a>, sebuah API yang menyediakan data komprehensif dari MyAnimeList. Kami juga memanfaatkan kekuatan <a href="https://developers.google.com/gemini" target="_blank" rel="noopener noreferrer" className="text-[#00ffc6] hover:underline">Google Gemini API</a> untuk fitur-fitur inovatif seperti penerjemahan sinopsis, menjadikan konten lebih mudah diakses oleh audiens yang lebih luas.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3 text-white">Untuk Komunitas</h2>
        <p>
          Website ini adalah proyek yang terus berkembang. Kami selalu terbuka untuk masukan dan saran dari komunitas. Tujuan kami adalah membangun platform yang benar-benar disukai dan bermanfaat bagi sesama penggemar anime. Terima kasih telah mengunjungi ENIM TOD, kami harap Anda menikmati pengalaman Anda!
        </p>
      </section>
    </div>
  </div>
);


export default App;
