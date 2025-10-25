import React from 'react';
// FIX: Updated to use react-router-dom v6 syntax.
import { Link, NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';

const Navbar: React.FC = () => {
  const activeLinkStyle = {
    color: '#00ffc6',
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-black/20">
      <nav className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Title and Navigation Links */}
        <div className="flex flex-col items-center md:items-start">
          <Link to="/" className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold tracking-wider text-[#00ffc6] transition-colors hover:text-white">
              ENIM TOD
            </h1>
          </Link>
          <div className="flex items-center space-x-6">
             <NavLink 
                to="/" 
                end
                className="text-gray-300 hover:text-[#00ffc6] transition-colors duration-300 font-medium"
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              >
                Beranda
              </NavLink>
              <NavLink 
                to="/ongoing" 
                className="text-gray-300 hover:text-[#00ffc6] transition-colors duration-300 font-medium"
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              >
                Ongoing
              </NavLink>
              <NavLink 
                to="/list" 
                className="text-gray-300 hover:text-[#00ffc6] transition-colors duration-300 font-medium"
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              >
                Daftar Anime
              </NavLink>
              <NavLink 
                to="/about" 
                className="text-gray-300 hover:text-[#00ffc6] transition-colors duration-300 font-medium"
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              >
                Tentang
              </NavLink>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-auto max-w-xs">
          <SearchBar />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;