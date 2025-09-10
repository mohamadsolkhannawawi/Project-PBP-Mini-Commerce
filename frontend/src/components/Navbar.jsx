import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, User } from 'lucide-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo atau Nama Toko */}
          <Link to="/" className="text-2xl font-bold text-gray-800">
            TokoKita
          </Link>

          {/* Navigasi untuk Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-500 transition-colors">Home</Link>
            <Link to="/products" className="text-gray-600 hover:text-blue-500 transition-colors">Produk</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-500 transition-colors">Tentang</Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-500 transition-colors">Kontak</Link>
          </div>

          {/* Ikon untuk Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="text-gray-600 hover:text-blue-500 transition-colors">
              <ShoppingCart size={24} />
            </Link>
            <Link to="/login" className="text-gray-600 hover:text-blue-500 transition-colors">
              <User size={24} />
            </Link>
          </div>
          
          {/* Tombol Menu untuk Mobile */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Navigasi untuk Mobile */}
      {isOpen && (
        <div className="md:hidden bg-white pb-4">
          <Link to="/" className="block py-2 px-4 text-sm hover:bg-gray-100" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/products" className="block py-2 px-4 text-sm hover:bg-gray-100" onClick={() => setIsOpen(false)}>Produk</Link>
          <Link to="/about" className="block py-2 px-4 text-sm hover:bg-gray-100" onClick={() => setIsOpen(false)}>Tentang</Link>
          <Link to="/contact" className="block py-2 px-4 text-sm hover:bg-gray-100" onClick={() => setIsOpen(false)}>Kontak</Link>
          <div className="border-t my-2"></div>
          <Link to="/cart" className="block py-2 px-4 text-sm hover:bg-gray-100" onClick={() => setIsOpen(false)}>Keranjang</Link>
          <Link to="/login" className="block py-2 px-4 text-sm hover:bg-gray-100" onClick={() => setIsOpen(false)}>Login</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;