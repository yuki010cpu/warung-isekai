import React, { useState, useEffect } from 'react';
// FIX: Replaced useHistory (v5) with useNavigate (v6) to fix module export error.
import { useNavigate, useLocation } from 'react-router-dom';

const SearchBar: React.FC = () => {
  // FIX: Replaced useHistory with useNavigate for react-router-dom v6.
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setQuery(q);
  }, [location.search]);
  

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      // FIX: Used navigate() for navigation in react-router-dom v6.
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari anime..."
        className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#00ffc6] transition-all duration-300"
      />
      <button type="submit" className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-[#00ffc6]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;