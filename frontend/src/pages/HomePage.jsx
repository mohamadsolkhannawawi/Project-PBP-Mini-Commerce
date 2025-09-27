// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';
import axiosClient from '../api/axiosClient';
import BannerSlider from '../components/BannerSlider';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const slides = [
    { src: undefined, title: 'A suit and A shoe' }, // uses BannerSlider placeholders
    { src: undefined, title: 'New arrivals for you' },
    { src: undefined, title: 'Deals of the week' },
  ];
  const categories = ['Semua Produk', 'Handphone', 'Laptop', 'Elektronik', 'Fashion', 'Buku'];

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get('/products');
        setProducts(data); setError(null);
      } catch (err) {
        let msg = 'Terjadi kesalahan yang tidak diketahui.';
        if (err.response) msg = `Error ${err.response.status}: ${err.response.data.message || 'Server tidak memberikan pesan detail.'}`;
        else if (err.request) msg = 'Tidak dapat terhubung ke server. Pastikan server backend berjalan dan konfigurasi CORS sudah benar.';
        else msg = err.message;
        setError(msg);
      } finally { setLoading(false); }
    })();
  }, []);

  return (
    <div
      className="px-4 md:px-2"
      style={{fontFamily: 'Poppins, ui-sans-serif, system-ui' }}
    >
      {/* Full screen minus navbar + tiny gap */}
      <section className="w-full">
        <BannerSlider height={`calc(80vh)`} />
      </section>

      {/* Category chips */}
      <section className="mb-8 mt-6 flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className="px-4 py-2 rounded-full text-sm font-medium text-white bg-[#1B263B] hover:brightness-90 transition"
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Products */}
      <section>
        {loading && <p>Memuat produk...</p>}
        {error && <p className="text-red-500 font-semibold bg-red-100 p-4 rounded-lg">Error: {error}</p>}
        {!loading && !error && <ProductList products={products} />}
      </section>
    </div>
  );
}
