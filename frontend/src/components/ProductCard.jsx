import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product, onAddToCart }) {
    let imageUrl = '';
    if (product.primary_image && product.primary_image.image_path) {
        // If image_path already starts with /storage or /public, use as is, else prepend
        if (product.primary_image.image_path.startsWith('http')) {
            imageUrl = product.primary_image.image_path;
        } else if (product.primary_image.image_path.startsWith('/storage')) {
            imageUrl = `http://localhost:8000${product.primary_image.image_path}`;
        } else if (product.primary_image.image_path.startsWith('public/')) {
            imageUrl = `http://localhost:8000/storage/${product.primary_image.image_path.replace(
                'public/',
                ''
            )}`;
        } else {
            imageUrl = `/no-image.webp`;
        }
    } else {
        imageUrl = `/no-image.webp`;
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
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
