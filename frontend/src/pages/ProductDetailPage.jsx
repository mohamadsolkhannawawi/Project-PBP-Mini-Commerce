// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import {
    ShoppingCart,
    ArrowLeft,
    Minus,
    Plus,
    CircleArrowLeft,
    CircleArrowRight,
} from 'lucide-react';
import { useCart } from '../contexts/CartContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx'; // ✅ TAMBAH INI
import StarRating from '../components/StarRating';
import { getImageUrl } from '../utils/imageUtils';

export default function ProductDetailPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { productId } = useParams();
    const { addToCart } = useCart();
    const { showSuccess, showError, showWarning } = useToast(); // ✅ TAMBAH INI

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Fetch product data
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get(`/products/${productId}`);
                // Pastikan ambil data dari res.data.data
                const data = res.data?.data || res.data;
                setProduct(data);
                if (data.primary_image) {
                    setActiveImage(data.primary_image);
                }
                setError(null);
            } catch (e) {
                setError('Produk tidak ditemukan atau gagal dimuat.');
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [productId]);

    // Set active image when product loads
    useEffect(() => {
        if (product && !activeImage) {
            const allImages = [
                product.primary_image,
                ...(product.gallery_images || []),
            ].filter(Boolean);

            if (allImages.length > 0) {
                setActiveImage(product.primary_image || allImages[0]);
            }
        }
    }, [product, activeImage]);

    // Keyboard navigation untuk gallery
    useEffect(() => {
        if (!product) return;

        const allImages = [
            product.primary_image,
            ...(product.gallery_images || []),
        ].filter(Boolean);

        const handleKeyPress = (e) => {
            if (allImages.length <= 1) return;

            const currentIndex = allImages.findIndex(
                (img) => img.id === activeImage?.id
            );
            if (currentIndex === -1) return;

            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex =
                    currentIndex === 0
                        ? allImages.length - 1
                        : currentIndex - 1;
                setActiveImage(allImages[prevIndex]);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex =
                    currentIndex === allImages.length - 1
                        ? 0
                        : currentIndex + 1;
                setActiveImage(allImages[nextIndex]);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [product, activeImage]);

    const dec = () => setQuantity((q) => Math.max(1, q - 1));
    const inc = () =>
        setQuantity((q) => Math.min(product?.stock ?? Infinity, q + 1));

    const handleAddToCart = async () => {
        if (!user) {
            showWarning('Silakan login untuk menambahkan produk ke keranjang.');
            navigate('/login');
            return;
        }
        if (product) {
            try {
                await addToCart(product, quantity);
            } catch (e) {
                console.error('Gagal menambahkan ke keranjang:', e);
                showError('Gagal menambahkan produk ke keranjang.');
            }
        }
    };

    // Navigation functions for gallery
    const goToPreviousImage = () => {
        if (allImages.length <= 1) return;
        const currentIndex = allImages.findIndex(
            (img) => img.id === activeImage?.id
        );
        if (currentIndex === -1) return;
        const prevIndex =
            currentIndex === 0 ? allImages.length - 1 : currentIndex - 1;
        setActiveImage(allImages[prevIndex]);
    };

    const goToNextImage = () => {
        if (allImages.length <= 1) return;
        const currentIndex = allImages.findIndex(
            (img) => img.id === activeImage?.id
        );
        if (currentIndex === -1) return;
        const nextIndex =
            currentIndex === allImages.length - 1 ? 0 : currentIndex + 1;
        setActiveImage(allImages[nextIndex]);
    };

    // Touch gesture handlers
    const handleTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && allImages.length > 1) {
            goToNextImage();
        }
        if (isRightSwipe && allImages.length > 1) {
            goToPreviousImage();
        }
    };

    if (loading)
        return <div className="text-center py-10">Memuat detail produk...</div>;
    if (error)
        return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!product) return null;

    // Ambil rating dan review count
    const avgRating = product.reviews_avg_rating || 0;
    const reviewCount = product.reviews_count || 0;

    // Ambil array review
    const reviews = product.reviews || [];

    // Gabungkan primary image dengan gallery images
    const allImages = [
        product.primary_image,
        ...(product.gallery_images || []),
    ].filter(Boolean);

    const imgSrc = getImageUrl(activeImage);

    return (
        <div
            className="container mx-auto px-4 md:px-8 py-6"
            style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}
        >
            {/* Tombol Kembali ke Home di pojok kiri atas */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 px-5 py-2.5
                        bg-[#1B263B] text-white rounded-lg
                        font-montserrat font-medium
                        hover:bg-[#131D2F] transition-all"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                    <ArrowLeft size={20} />
                    Kembali ke Home
                </button>
            </div>

            {/* 3/5 image + 2/5 details */}
            <div className="grid grid-cols-1 md:grid-cols-5 md:gap-10 items-start">
                {/* LEFT: image area (3/5) */}
                <div className="md:col-span-3">
                    <div className="rounded-[14px] bg-gray-200 p-3 md:p-4 shadow-sm relative">
                        <div
                            className="w-full min-h-[60vh] md:min-h-[70vh] rounded-[14px] bg-gray-300 overflow-hidden flex items-center justify-center relative group"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <img
                                src={imgSrc}
                                alt={product.name}
                                className="w-full h-full object-contain transition-opacity duration-300"
                                loading="eager"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = '/no-image.webp';
                                }}
                            />

                            {/* Navigation Buttons - Only show if there are multiple images */}
                            {allImages.length > 1 && (
                                <>
                                    {/* Previous Button */}
                                    <button
                                        onClick={goToPreviousImage}
                                        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 
                                                 bg-white bg-opacity-90 hover:bg-opacity-100 
                                                 text-gray-800 rounded-full p-1.5 md:p-2 
                                                 shadow-lg transition-all duration-200 
                                                 opacity-70 md:opacity-0 md:group-hover:opacity-100
                                                 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500
                                                 z-10"
                                        aria-label="Previous Image"
                                        title="Previous Image (Arrow Left)"
                                    >
                                        <CircleArrowLeft
                                            size={28}
                                            className="text-gray-700 md:w-8 md:h-8"
                                        />
                                    </button>

                                    {/* Next Button */}
                                    <button
                                        onClick={goToNextImage}
                                        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 
                                                 bg-white bg-opacity-90 hover:bg-opacity-100 
                                                 text-gray-800 rounded-full p-1.5 md:p-2 
                                                 shadow-lg transition-all duration-200 
                                                 opacity-70 md:opacity-0 md:group-hover:opacity-100
                                                 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500
                                                 z-10"
                                        aria-label="Next Image"
                                        title="Next Image (Arrow Right)"
                                    >
                                        <CircleArrowRight
                                            size={28}
                                            className="text-gray-700 md:w-8 md:h-8"
                                        />
                                    </button>
                                </>
                            )}

                            {/* Image Counter */}
                            {allImages.length > 1 && (
                                <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {activeImage
                                        ? allImages.findIndex(
                                              (img) => img.id === activeImage.id
                                          ) + 1
                                        : 1}{' '}
                                    / {allImages.length}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Thumbnail Gallery */}
                    {allImages.length > 1 && (
                        <div className="mt-4">
                            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                                {allImages.map((image, index) => {
                                    const thumb = getImageUrl(image);
                                    const isActive =
                                        activeImage &&
                                        activeImage.id === image.id;
                                    return (
                                        <div
                                            key={image.id || index}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg cursor-pointer overflow-hidden border-2 transition-all duration-200 ${
                                                isActive
                                                    ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg'
                                                    : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
                                            }`}
                                            onClick={() =>
                                                setActiveImage(image)
                                            }
                                        >
                                            <img
                                                src={thumb}
                                                alt={`${product.name} - Image ${
                                                    index + 1
                                                }`}
                                                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                                                onError={(e) => {
                                                    e.currentTarget.onerror =
                                                        null;
                                                    e.currentTarget.src =
                                                        '/no-image.webp';
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT: details (2/5) */}
                <div className="md:col-span-2 max-w-xl md:max-w-none mt-6 md:mt-0">
                    <h1 className="text-3xl md:text-5xl font-medium text-gray-900 mb-3">
                        {product.name}
                    </h1>
                    {/* Rating dan jumlah review */}
                    <div className="flex items-center gap-2 mb-2">
                        <StarRating rating={avgRating} />
                        <span className="text-sm text-yellow-600">
                            ({reviewCount} ulasan)
                        </span>
                    </div>

                    <p className="text-xl md:text-4xl font-bold text-[#415A77] mb-4">
                        Rp{' '}
                        {new Intl.NumberFormat('id-ID').format(product.price)}
                    </p>

                    <p className="text-gray-700 md:text-m leading-relaxed mb-6">
                        {product.description ||
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
                    </p>

                    {user?.role !== 'admin' && (
                        <>
                            {/* Quantity UI — smaller */}
                            <div className="flex items-center gap-3 mb-2">
                                {/* Left: white square display (smaller) */}
                                <div className="h-12 w-12 rounded-[10px] bg-white border border-gray-300 flex items-center justify-center">
                                    <span className="text-lg font-semibold text-black leading-none">
                                        {quantity}
                                    </span>
                                </div>

                                {/* Right: dark pill with minus | plus (smaller) */}
                                <div className="h-7 px-2 rounded-full bg-[#415A77] text-white flex items-center">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((q) =>
                                                Math.max(1, q - 1)
                                            )
                                        }
                                        aria-label="Kurangi"
                                        className="h-4 w-4 rounded-full border border-white flex items-center justify-center  mr-4 hover:bg-white/10"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        >
                                            <line
                                                x1="5"
                                                y1="12"
                                                x2="19"
                                                y2="12"
                                            />
                                        </svg>
                                    </button>

                                    <span className="h-4 w-px bg-white/80" />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((q) =>
                                                Math.min(
                                                    product?.stock ?? Infinity,
                                                    q + 1
                                                )
                                            )
                                        }
                                        aria-label="Tambah"
                                        className="h-4 w-4 rounded-full border border-white flex items-center justify-center ml-4 hover:bg-white/10"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        >
                                            <line
                                                x1="12"
                                                y1="5"
                                                x2="12"
                                                y2="19"
                                            />
                                            <line
                                                x1="5"
                                                y1="12"
                                                x2="19"
                                                y2="12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-5">
                                Stok: {product.stock ?? 0}
                            </p>

                            {/* Add to Cart */}
                            <button
                                onClick={handleAddToCart}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#1B263B] text-white font-semibold py-3 px-6 hover:brightness-110 transition"
                            >
                                <ShoppingCart size={20} />
                                Tambahkan ke Keranjang
                            </button>
                        </>
                    )}
                </div>
            </div>
            {/* Customer Reviews Section */}
            <div className="mt-10">
                <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
                {reviews.length === 0 ? (
                    <div className="text-gray-500">
                        Belum ada ulasan untuk produk ini.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="border rounded-lg p-4 bg-white shadow"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-800">
                                        {review.user?.name || 'User'}
                                    </span>
                                    <StarRating rating={review.rating} />
                                </div>
                                <div className="text-gray-700 text-sm">
                                    {review.comment}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
