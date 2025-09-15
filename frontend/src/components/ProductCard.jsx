import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const imageUrl = product.image_url || `https://via.placeholder.com/300x300.png?text=${product.name}`;

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link to={`/product/${product.slug}`}>
        <img src={imageUrl} alt={product.name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
          <p className="text-gray-600 mt-2">Rp {new Intl.NumberFormat('id-ID').format(product.price)}</p>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;