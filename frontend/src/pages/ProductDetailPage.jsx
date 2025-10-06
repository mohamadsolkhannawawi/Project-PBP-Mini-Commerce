// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useCart } from '../contexts/CartContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import StarRating from '../components/StarRating';

export default function ProductDetailPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { productId } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImage, setActiveImage] = useState(null);

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

    const dec = () => setQuantity((q) => Math.max(1, q - 1));
    const inc = () =>
        setQuantity((q) => Math.min(product?.stock ?? Infinity, q + 1));

    const handleAddToCart = async () => {
        if (!user) {
            alert('Silakan login untuk menambahkan produk ke keranjang.');
            navigate('/login');
            return;
        }
        if (product) {
            try {
                await addToCart(product, quantity);
                alert(
                    `${quantity} ${product.name} telah ditambahkan ke keranjang!`
                );
            } catch (e) {
                console.error('Gagal menambahkan ke keranjang:', e);
            }
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

    const allImages = [
        product.primary_image,
        ...(product.galleryImages || []),
    ].filter(Boolean);

    let imgSrc = '';
    if (activeImage && activeImage.image_path) {
        const path = activeImage.image_path;
        if (path.startsWith('http')) {
            imgSrc = path;
        } else if (path.startsWith('/storage')) {
            imgSrc = `http://localhost:8000${path}`;
        } else if (path.startsWith('public/')) {
            imgSrc = `http://localhost:8000/storage/${path.replace(
                'public/',
                ''
            )}`;
        } else {
            imgSrc = '/no-image.webp';
        }
    } else {
        imgSrc = '/no-image.webp';
    }

    return (
        <div
            className="container mx-auto px-4 md:px-8 py-6"
            style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui' }}
        >
            {/* Tombol Kembali ke Home di pojok kiri atas */}
            <div className="mb-6">
            <button
                onClick={() => navigate("/")}
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
                    <div className="rounded-[14px] bg-gray-200 p-3 md:p-4 shadow-sm">
                        <div className="w-full min-h-[60vh] md:min-h-[70vh] rounded-[14px] bg-gray-300 overflow-hidden flex items-center justify-center">
                            <img
                                src={imgSrc}
                                alt={product.name}
                                className="w-full h-full object-contain"
                                loading="eager"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = '/no-image.webp';
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex space-x-2 mt-2">
                        {allImages.map((image) => {
                            let thumb = '';
                            if (image.image_path.startsWith('http')) {
                                thumb = image.image_path;
                            } else if (
                                image.image_path.startsWith('/storage')
                            ) {
                                thumb = `http://localhost:8000${image.image_path}`;
                            } else if (image.image_path.startsWith('public/')) {
                                thumb = `http://localhost:8000/storage/${image.image_path.replace(
                                    'public/',
                                    ''
                                )}`;
                            } else {
                                thumb = '/no-image.webp';
                            }
                            return (
                                <div
                                    key={image.id}
                                    className={`w-20 h-20 rounded-md cursor-pointer overflow-hidden ${
                                        activeImage.id === image.id
                                            ? 'ring-2 ring-blue-500'
                                            : ''
                                    }`}
                                    onClick={() => setActiveImage(image)}
                                >
                                    <img
                                        src={thumb}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            );
                        })}
                    </div>
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
