import React from 'react';
import { ShoppingCart } from 'lucide-react';

function ProductCard({ product }) {
  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="w-full h-48 bg-gray-200">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Error'; }}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg text-gray-800 flex-grow">{product.name}</h3>
        <p className="text-blue-600 font-bold text-xl my-2">Rp {product.price}</p>
        <button className="w-full mt-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center transition-colors">
          <ShoppingCart size={18} className="mr-2" />
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
}

export default ProductCard;