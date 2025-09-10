import React from 'react';
import ProductList from '../components/ProductList';

// Data produk tiruan untuk ditampilkan sebelum terhubung ke backend
const mockProducts = [
  { id: 1, name: 'Smartphone Pro X', price: '15.000.000', imageUrl: 'https://placehold.co/600x400/3498db/ffffff?text=Smartphone' },
  { id: 2, name: 'Laptop UltraBook 14', price: '22.500.000', imageUrl: 'https://placehold.co/600x400/2ecc71/ffffff?text=Laptop' },
  { id: 3, name: 'Headphone Noise Cancelling', price: '4.200.000', imageUrl: 'https://placehold.co/600x400/e74c3c/ffffff?text=Headphone' },
  { id: 4, name: 'Smartwatch Series 8', price: '7.800.000', imageUrl: 'https://placehold.co/600x400/9b59b6/ffffff?text=Smartwatch' },
  { id: 5, name: 'Kamera Mirrorless A7', price: '35.000.000', imageUrl: 'https://placehold.co/600x400/f1c40f/ffffff?text=Kamera' },
  { id: 6, name: 'Tablet Pro 11 inch', price: '13.500.000', imageUrl: 'https://placehold.co/600x400/1abc9c/ffffff?text=Tablet' },
  { id: 7, name: 'Wireless Earbuds V2', price: '2.100.000', imageUrl: 'https://placehold.co/600x400/e67e22/ffffff?text=Earbuds' },
  { id: 8, name: 'Gaming Console NextGen', price: '9.300.000', imageUrl: 'https://placehold.co/600x400/34495e/ffffff?text=Console' },
];

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