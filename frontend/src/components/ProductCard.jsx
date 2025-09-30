import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

import StarRating from './StarRating';

function ProductCard({ product, onAddToCart }) {
    let imageUrl = '';
    if (product.primary_image && product.primary_image.image_path) {
        const path = product.primary_image.image_path;
        if (path.startsWith('http')) {
            imageUrl = path;
        } else if (path.startsWith('/storage')) {
            imageUrl = `http://localhost:8000${path}`;
        } else if (path.startsWith('public/')) {
            imageUrl = `http://localhost:8000/storage/${path.replace(
                'public/',
                ''
            )}`;
        } else {
            imageUrl = '/no-image.webp';
        }
    } else {
        imageUrl = '/no-image.webp';
    }

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof onAddToCart === 'function') onAddToCart(product);
    };

    return (
        <Link
            to={`/product/${product.slug}`}
            className="block"
            aria-label={`Lihat ${product.name}`}
        >
            <div
                className="overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-gray-100 rounded-[14px]"
                style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}
            >
                {/* Taller image area */}
                <div className="bg-gray-200 h-80 md:h-80 flex items-center justify-center rounded-t-[14px] overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="max-h-full w-auto object-contain p-6"
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/no-image.webp';
                        }}
                    />
                </div>

                {/* Taller footer */}
                <div className="bg-[#415A77] text-white px-5 py-14 flex items-center justify-center">
                    <div className="min-w-0 leading-snug text-center">
                        {/* Extra large product name */}
                        <h3 className="text-2xl md:text-2xl font-regular">
                            {product.name}
                        </h3>
                        {/* Bigger price */}
                        <div className="mt-2 font-bold text-base md:text-xl">
                            Rp
                            {new Intl.NumberFormat('id-ID').format(
                                product.price
                            )}
                        </div>

                        {/* Rating, review count, sold count */}
                        <div className="flex items-center justify-center gap-3 mt-2">
                            <StarRating
                                rating={product.reviews_avg_rating || 0}
                            />
                            <span className="text-sm text-yellow-200">
                                ({product.reviews_count || 0})
                            </span>
                            <span className="text-xs text-gray-200 ml-2">
                                Terjual: {product.order_items_count || 0}
                            </span>
                        </div>
                    </div>

                    {/* Quick Add to Cart */}
                    <button
                        className="absolute top-4 right-4 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-2 shadow-lg"
                        onClick={handleAddToCart}
                        aria-label="Tambah ke Keranjang"
                    >
                        <ShoppingCart size={22} />
                    </button>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
