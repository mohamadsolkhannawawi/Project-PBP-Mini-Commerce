import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product, onAddToCart }) {
    const imageUrl =
        product?.image_url ||
        `https://via.placeholder.com/600x600.png?text=${encodeURIComponent(
            product?.name || 'Produk'
        )}`;

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
                            e.currentTarget.src = `https://via.placeholder.com/600x600.png?text=${encodeURIComponent(
                                product?.name || 'Produk'
                            )}`;
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
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
