
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-4 mt-8">
      <div className="container mx-auto px-4 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} ENIM TOD. Dibuat oleh yuki heker.</p>
      </div>
    </footer>
  );
};

export default Footer;
