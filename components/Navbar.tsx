import React from 'react';
// FIX: Updated to use react-router-dom v6 syntax.
import { Link, NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';

const Navbar: React.FC = () => {
  const activeLinkStyle = {
    color: '#00ffc6',
    borderBottom: '2px solid #00ffc6',
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-black/20">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold tracking-wider text-[#00ffc6] transition-colors hover:text-white">
            ENIM TOD
          </h1>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <NavLink 
            to="/" 
            end
            className="text-gray-300 hover:text-[#00ffc6] transition-colors duration-300 pb-1"
            // FIX: Replaced activeStyle prop with style function for react-router-dom v6 compatibility.
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          >
            Beranda
          </NavLink>
          <NavLink 
            to="/list" 
            className="text-gray-300 hover:text-[#00ffc6] transition-colors duration-300 pb-1"
            // FIX: Replaced activeStyle prop with style function for react-router-dom v6 compatibility.
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
           >
             Daftar Anime
           </NavLink>
          <NavLink 
            to="/about" 
            className="text-gray-300 hover:text-[#00ffc6] transition-colors duration-300 pb-1"
            // FIX: Replaced activeStyle prop with style function for react-router-dom v6 compatibility.
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          >
            Tentang
          </NavLink>
        </div>
        <div className="w-full md:w-auto max-w-xs">
          <SearchBar />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;