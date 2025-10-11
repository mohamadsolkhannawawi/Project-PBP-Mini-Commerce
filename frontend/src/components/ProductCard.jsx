import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

import StarRating from './StarRating';
import { getProductImageUrl } from '../utils/imageUtils';

function ProductCard({ product, onAddToCart }) {
    const imageUrl = getProductImageUrl(product);

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
                className="overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl border border-[#415A77]-100"
                style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}
            >
                <div className="relative h-56 md:h-64 rounded-t-[14px] overflow-hidden bg-white">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover block"
                    loading="lazy"
                    onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/no-image.webp';
                    }}
                />
                </div>

                {/* Taller footer */}
                <div className="bg-[#415A77] text-white px-5 py-12 flex items-center justify-left relative">
                    <div className="min-w-0 leading-snug text-left">
                        <h3 className="text-2xl md:text-2xl font-regular truncate whitespace-nowrap overflow-hidden">
                            {product.name}
                        </h3>
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
                            <span className="text-sm text-gray-400">
                                ({product.reviews_count || 0})
                            </span>
                            <span className="text-xs text-gray-400 ml-2">
                                Terjual: {product.order_items_count || 0}
                            </span>
                        </div>
                    </div>

                    {/* Quick Add to Cart */}
                    {/* <button
                        className="absolute bottom-4 right-4 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-2 shadow-sm"
                        onClick={handleAddToCart}
                        aria-label="Tambah ke Keranjang"
                    >
                        <ShoppingCart size={16} />
                    </button> */}
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
