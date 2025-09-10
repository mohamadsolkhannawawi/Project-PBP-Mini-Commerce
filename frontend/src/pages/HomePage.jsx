import React from 'react';
import ProductList from '../components/ProductList';
import { mockProducts } from '../data/mockData';

function HomePage() {
  return (
    <div>
      {/* Hero Banner Section */}
      <section className="bg-blue-600 text-white rounded-lg p-8 md:p-12 mb-8 flex flex-col items-center text-center">
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-6">Koleksi Terbaru Telah Tiba</h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl">Jelajahi gadget dan elektronik terbaik dengan penawaran eksklusif yang tidak akan Anda temukan di tempat lain.</p>
        <button className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105">
          Belanja Sekarang
        </button>
      </section>

      {/* Product List Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Produk Unggulan</h2>
        <ProductList products={mockProducts} />
      </section>
    </div>
  );
}

export default HomePage;