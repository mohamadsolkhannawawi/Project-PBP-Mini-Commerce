import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockProducts } from '../data/mockData'; // Ambil data dari file terpusat
import { ShoppingCart, ArrowLeft } from 'lucide-react';

function ProductDetailPage() {
  const { productId } = useParams();
  const product = mockProducts.find(p => p.id === parseInt(productId));

  // Tampilkan pesan jika produk tidak ditemukan
  if (!product) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Produk tidak ditemukan!</h2>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Kembali ke Beranda</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-blue-600 hover:underline mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Kembali ke semua produk
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kolom Gambar */}
        <div>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Kolom Detail Produk */}
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-3xl font-light text-blue-600 mb-6">Rp {product.price}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="flex items-center mb-6">
            <label htmlFor="quantity" className="mr-4 font-semibold">Jumlah:</label>
            <input 
              type="number" 
              id="quantity" 
              name="quantity" 
              defaultValue="1" 
              min="1" 
              className="w-20 p-2 border rounded-lg text-center"
            />
          </div>

          <button className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 flex items-center justify-center transition-colors">
            <ShoppingCart size={20} className="mr-2" />
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;