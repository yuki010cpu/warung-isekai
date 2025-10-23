// External library imports
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  HashRouter, 
  Routes, 
  Route, 
  Link, 
  NavLink, 
  useNavigate, 
  useLocation, 
  useParams 
} from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

// --- From types.ts ---
interface JikanImage {
  jpg: { image_url: string; small_image_url: string; large_image_url: string; };
  webp: { image_url: string; small_image_url: string; large_image_url: string; };
}
interface Anime {
  mal_id: number;
  url: string;
  images: JikanImage;
  title: string;
  title_english: string;
  title_japanese: string;
  synopsis: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  genres: { mal_id: number; name: string }[];
  studios: { mal_id: number; name: string }[];
  rating: string;
  status: string;
  episodes: number;
  duration: string;
  year: number;
  trailer: { youtube_id: string; url: string; embed_url: string; }
}
interface JikanResponse<T> { data: T; }
interface JikanSearchResponse {
    data: Anime[];
    pagination: {
        last_visible_page: number;
        has_next_page: boolean;
        current_page: number;
        items: { count: number; total: number; per_page: number; }
    }
}

// --- From services/jikanService.ts ---
const API_BASE_URL = 'https://api.jikan.moe/v4';
const fetchWithRateLimit = async <T,>(url: string): Promise<T> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};
const getTopAnime = async (): Promise<Anime[]> => {
  const response = await fetchWithRateLimit<JikanSearchResponse>(`${API_BASE_URL}/top/anime?filter=bypopularity&limit=24`);
  return response.data;
};
const searchAnime = async (query: string): Promise<Anime[]> => {
  const response = await fetchWithRateLimit<JikanSearchResponse>(`${API_BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=24`);
  return response.data;
};
const getAnimeDetails = async (id: string): Promise<Anime> => {
  const response = await fetchWithRateLimit<JikanResponse<Anime>>(`${API_BASE_URL}/anime/${id}/full`);
  return response.data;
};

// --- From services/geminiService.ts ---
// PENTING: Ganti "MASUKKAN_API_KEY_ANDA_DI_SINI" dengan Google AI API key Anda yang sebenarnya.
// Untuk menjaga kerahasiaan kunci Anda, jangan bagikan file ini secara publik setelah menambahkan kunci.
const API_KEY = "AIzaSyDre_TsgJrh57tlmaav-TJsTLWOvBLdZag";

let ai: GoogleGenAI | null = null;
if (API_KEY && API_KEY !== "AIzaSyDre_TsgJrh57tlmaav-TJsTLWOvBLdZag") {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.error("Gagal menginisialisasi GoogleGenAI. Periksa API Key Anda.", error);
  }
}

const translateText = async (text: string): Promise<string> => {
  if (!text) return "Tidak ada sinopsis.";
  if (!ai) {
    return "Fitur terjemahan nonaktif. Silakan konfigurasikan API Key dalam kode.";
  }
  try {
    const prompt = `Translate the following anime synopsis to Indonesian. Keep the tone engaging and appropriate for an anime description. Do not add any extra commentary or introductory phrases like "Berikut terjemahannya:". Just provide the translated text directly.\n\nSynopsis:\n"""\n${text}\n"""`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text.trim();
  } catch (error) {
    console.error("Error translating text with Gemini:", error);
    return "Gagal menerjemahkan sinopsis. Menampilkan teks asli.";
  }
};


// --- From components/LoadingSpinner.tsx ---
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-10">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#00ffc6]"></div>
  </div>
);

// --- From components/AnimeCard.tsx ---
interface AnimeCardProps { anime: Anime; }
const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#00ffc6]/20">
    <Link to={`/anime/${anime.mal_id}`} className="block">
      <div className="relative aspect-[2/3]">
        <img src={anime.images.webp.large_image_url} alt={anime.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-3">
          <h3 className="text-white font-semibold text-base leading-tight drop-shadow-md">{anime.title}</h3>
        </div>
      </div>
    </Link>
  </div>
);

// --- From components/SearchBar.tsx ---
const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get('q') || '');
  }, [location.search]);
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari anime..." className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#00ffc6] transition-all duration-300" />
      <button type="submit" className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-[#00ffc6]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
      </button>
    </form>
  );
};

// --- From components/Navbar.tsx ---
const Navbar: React.FC = () => {
  const activeLinkStyle = { color: '#00ffc6', borderBottom: '2px solid #00ffc6' };
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-black/20">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold tracking-wider text-[#00ffc6] transition-colors hover:text-white">ENIM TOD</h1>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" end className="text-gray-300 hover:text-[#00ffc6] transition-colors duration-300 pb-1" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}>Beranda</NavLink>
          <NavLink to="/list" className="text-gray-300 hover:text-[#00ffc6] transition-colors duration-300 pb-1" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}>Daftar Anime</NavLink>
          <NavLink to="/about" className="text-gray-300 hover:text-[#00ffc6] transition-colors duration-300 pb-1" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}>Tentang</NavLink>
        </div>
        <div className="w-full md:w-auto max-w-xs"><SearchBar /></div>
      </nav>
    </header>
  );
};

// --- From components/Footer.tsx ---
const Footer: React.FC = () => (
  <footer className="bg-gray-900 border-t border-gray-800 py-4 mt-8">
    <div className="container mx-auto px-4 text-center text-gray-500">
      <p>&copy; {new Date().getFullYear()} ENIM TOD. Dibuat oleh yuki heker.</p>
    </div>
  </footer>
);

// --- From components/LoadingScreen.tsx ---
const LoadingScreen: React.FC = () => (
  <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
    <div className="text-center">
      <h1 className="text-5xl font-bold text-[#00ffc6] animate-pulse" style={{ textShadow: '0 0 10px #00ffc6, 0 0 20px #00ffc6' }}>ENIM TOD</h1>
      <p className="text-gray-400 mt-2">Memuat dunia wibu...</p>
    </div>
  </div>
);

// --- From components/DummyPlayer.tsx ---
interface DummyPlayerProps { imageUrl: string; title: string; onPlayClick: () => void; }
const DummyPlayer: React.FC<DummyPlayerProps> = ({ imageUrl, title, onPlayClick }) => (
  <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg shadow-black/50 group">
    <img src={imageUrl} alt={`Poster for ${title}`} className="w-full h-full object-cover opacity-50" />
    <div className="absolute inset-0 flex items-center justify-center">
      <button onClick={onPlayClick} className="transform transition-transform duration-300 group-hover:scale-110 focus:outline-none" aria-label="Play video">
        <div className="w-24 h-24 bg-[#00ffc6]/80 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-[#00ffc6]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-black" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
        </div>
      </button>
    </div>
    <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
      <h2 className="text-xl font-bold text-white">Menonton: {title}</h2>
    </div>
  </div>
);

// --- From components/Modal.tsx ---
interface ModalProps { isOpen: boolean; onClose: () => void; children: React.ReactNode; }
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-lg shadow-2xl shadow-black/50 p-6 m-4 max-w-sm w-full transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
      <style>{`@keyframes fadeInScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } .animate-fade-in-scale { animation: fadeInScale 0.3s forwards; }`}</style>
    </div>
  );
};

// --- From pages/HomePage.tsx ---
const HomePage: React.FC = () => {
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchPopularAnime = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTopAnime();
        setPopularAnime(data);
      } catch (err) {
        setError('Gagal memuat anime populer. Coba lagi nanti.');
        console.error(err);
      } finally { setLoading(false); }
    };
    fetchPopularAnime();
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-[#00ffc6]">Anime Populer Teratas</h1>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {popularAnime.map((anime) => (<AnimeCard key={anime.mal_id} anime={anime} />))}
        </div>
      )}
    </div>
  );
};

// --- From pages/SearchPage.tsx ---
const SearchPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!query) { setSearchResults([]); return; }
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await searchAnime(query);
        setSearchResults(data);
      } catch (err) {
        setError('Gagal melakukan pencarian. Coba lagi nanti.');
        console.error(err);
      } finally { setLoading(false); }
    };
    fetchSearchResults();
  }, [query]);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Hasil Pencarian untuk: <span className="text-[#00ffc6]">{query}</span></h1>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && !error && (
        <>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {searchResults.map((anime) => (<AnimeCard key={anime.mal_id} anime={anime} />))}
            </div>
          ) : (<p className="text-center text-gray-400 mt-8">Tidak ada hasil yang ditemukan untuk "{query}".</p>)}
        </>
      )}
    </div>
  );
};

// --- From pages/DetailPage.tsx ---
const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [translatedSynopsis, setTranslatedSynopsis] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        } else { setTranslatedSynopsis("Tidak ada sinopsis yang tersedia."); }
      } catch (err) {
        setError('Gagal memuat detail anime. Mungkin anime ini tidak ada.');
        console.error(err);
      } finally { setLoading(false); }
    };
    fetchDetails();
  }, [id]);
  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!anime) return <p className="text-center">Anime tidak ditemukan.</p>;
  return (
    <>
      <div className="space-y-8">
        <div><DummyPlayer imageUrl={anime.images.webp.large_image_url} title={anime.title} onPlayClick={() => setIsModalOpen(true)} /></div>
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4 flex-shrink-0"><img src={anime.images.webp.large_image_url} alt={anime.title} className="w-full rounded-lg shadow-lg" /></div>
            <div className="md:w-3/4 space-y-4">
              <h1 className="text-4xl font-bold text-white">{anime.title}</h1>
              <div className="flex items-center space-x-4 text-gray-400">
                <span className="flex items-center space-x-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg><span>{anime.score || 'N/A'}</span></span>
                <span>•</span><span>{anime.year || 'N/A'}</span><span>•</span><span>{anime.status}</span><span>•</span><span>{anime.episodes ? `${anime.episodes} episode` : 'N/A'}</span>
              </div>
              <div className="flex flex-wrap gap-2">{anime.genres.map(genre => (<span key={genre.mal_id} className="bg-[#00ffc6]/20 text-[#00ffc6] text-xs font-semibold px-2.5 py-0.5 rounded-full">{genre.name}</span>))}</div>
              <div>
                <h2 className="text-xl font-semibold mb-2 text-[#00ffc6]">Sinopsis</h2>
                {translating ? (<p className="text-gray-400 animate-pulse">Menerjemahkan...</p>) : (<p className="text-gray-300 leading-relaxed">{translatedSynopsis}</p>)}
              </div>
              <div className="pt-4"><button onClick={() => setIsModalOpen(true)} className="inline-block bg-[#00ffc6] text-gray-900 font-bold py-3 px-8 rounded-full text-lg transform transition-transform hover:scale-105 hover:shadow-lg hover:shadow-[#00ffc6]/30">Tonton Sekarang</button></div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[#00ffc6] mb-4">Segera Hadir!</h3>
          <p className="text-gray-300 mb-6">Vidio menyusul, heker yuki kurang dana.</p>
          <button onClick={() => setIsModalOpen(false)} className="bg-[#00ffc6]/20 text-[#00ffc6] font-bold py-2 px-6 rounded-full transition-colors hover:bg-[#00ffc6] hover:text-gray-900">Mengerti</button>
        </div>
      </Modal>
    </>
  );
};

// --- From pages/NotFoundPage.tsx ---
const NotFoundPage: React.FC = () => (
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

// --- From App.tsx ---
const AboutPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center py-10">
    <h1 className="text-4xl font-bold text-[#00ffc6] mb-4">Tentang ENIM TOD</h1>
    <p className="max-w-2xl text-gray-300 leading-relaxed">
      ENIM TOD adalah proyek website streaming anime yang dibuat dengan rasa malas,
      menggunakan teknologi canggih seperti Bahlil, Mulyono, dan Jawa Koenji. 
      Kami mengambil data dari Jikan API untuk menyajikan informasi anime terkini.
      Website ini didesain dengan tema gelap yang elegan untuk kenyamanan mata Anda saat menjelajahi dunia anime.
    </p>
  </div>
);
const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => { setIsAppLoading(false); }, 1500);
    return () => clearTimeout(timer);
  }, []);
  if (isAppLoading) { return <LoadingScreen />; }
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
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

// --- From original index.tsx ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
