import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom'; // <-- IMPORT LINK

function ProductCard({ product }) {
  return (
    // Bungkus seluruh kartu dengan Link
    <Link to={`/product/${product.id}`} className="block bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="w-full h-48 bg-gray-200">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg text-gray-800 flex-grow">{product.name}</h3>
        <p className="text-blue-600 font-bold text-xl my-2">Rp {product.price}</p>
        <div className="w-full mt-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center transition-colors">
          <ShoppingCart size={18} className="mr-2" />
          Lihat Detail
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;