import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext'; // ✅ TAMBAH INI

import StarRating from './StarRating';
import { getProductImageUrl } from '../utils/imageUtils';

function ProductCard({ product, onAddToCart }) {
    const [loading, setLoading] = useState(false);
    const { addToCart } = useCart();
    const { showSuccess, showError, showLoading, updateToast } = useToast(); // ✅ TAMBAH INI
    
    const imageUrl = getProductImageUrl(product);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // ✅ SHOW LOADING TOAST
        const toastId = showLoading("Menambahkan ke keranjang...");
        
        try {
            setLoading(true);
            
            if (typeof onAddToCart === 'function') {
                await onAddToCart(product);
                // ✅ SUCCESS TOAST
                updateToast(toastId, `${product.name} berhasil ditambahkan ke keranjang!`, 'success');
            } else {
                // Fallback jika tidak ada onAddToCart function
                await addToCart(product, 1);
                updateToast(toastId, `${product.name} berhasil ditambahkan ke keranjang!`, 'success');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            const errorMessage = error.message || 'Gagal menambahkan produk ke keranjang';
            // ✅ ERROR TOAST
            updateToast(toastId, errorMessage, 'error');
        } finally {
            setLoading(false);
        }
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

                    {/* Quick Add to Cart dengan loading state */}
                    <button
                        className={`absolute top-4 right-4 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-2 shadow-lg transition-all ${
                            loading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                        onClick={handleAddToCart}
                        disabled={loading}
                        aria-label="Tambah ke Keranjang"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <ShoppingCart size={22} />
                        )}
                    </button>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;