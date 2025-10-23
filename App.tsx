import React, { useState, useEffect } from 'react';
// FIX: Updated to react-router-dom v6. Replaced Switch with Routes.
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import DetailPage from './pages/DetailPage';
import LoadingScreen from './components/LoadingScreen';
import NotFoundPage from './pages/NotFoundPage';

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
            <Route path="/list" element={<HomePage />} /> 
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

// Simple About page component
const AboutPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <h1 className="text-4xl font-bold text-[#00ffc6] mb-4">Tentang ENIM TOD</h1>
    <p className="max-w-2xl">
      ENIM TOD adalah proyek website streaming anime yang dibuat dengan penuh semangat,
      menggunakan teknologi modern seperti React, TypeScript, dan Tailwind CSS. 
      Kami mengambil data dari Jikan API untuk menyajikan informasi anime terkini.
      Website ini didesain dengan tema gelap yang elegan untuk kenyamanan mata Anda saat menjelajahi dunia anime.
    </p>
  </div>
);


export default App;