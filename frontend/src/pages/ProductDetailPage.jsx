import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

function ProductDetailPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { productId } = useParams();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get(
                    `/products/${productId}`
                );
                setProduct(response.data);
                setError(null);
            } catch (err) {
                setError('Produk tidak ditemukan atau gagal dimuat.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

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
            } catch (error) {
                console.error('Gagal menambahkan ke keranjang dari ProductDetailPage:', error);
            }
        }
    };

    if (loading) {
        return <div className="text-center py-10">Memuat detail produk...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (!product) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold">Produk tidak ditemukan!</h2>
                <Link
                    to="/"
                    className="text-blue-600 hover:underline mt-4 inline-block"
                >
                    Kembali ke Beranda
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link
                to="/"
                className="inline-flex items-center text-blue-600 hover:underline mb-6"
            >
                <ArrowLeft size={20} className="mr-2" />
                Kembali ke semua produk
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-auto rounded-lg shadow-lg object-cover"
                    />
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        {product.name}
                    </h1>
                    <p className="text-3xl font-light text-blue-600 mb-6">
                        Rp{' '}
                        {new Intl.NumberFormat('id-ID').format(product.price)}
                    </p>
                    <p className="text-gray-600 mb-6">{product.description}</p>

                    {user?.role !== 'admin' && (
                        <>
                            <div className="flex items-center mb-4">
                                <div className="flex items-center">
                                    <label
                                        htmlFor="quantity"
                                        className="mr-4 font-semibold"
                                    >
                                        Jumlah:
                                    </label>
                                    <div className="flex items-center border rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-3 py-1 border-r bg-gray-100 hover:bg-gray-200 rounded-l-lg"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            id="quantity"
                                            value={quantity}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                if (isNaN(value)) {
                                                    setQuantity(1);
                                                } else if (value > product.stock) {
                                                    setQuantity(product.stock);
                                                } else {
                                                    setQuantity(value);
                                                }
                                            }}
                                            min="1"
                                            max={product.stock}
                                            className="w-16 p-2 text-center"
                                        />
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="px-3 py-1 border-l bg-gray-100 hover:bg-gray-200 rounded-r-lg"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Stok: {product.stock}
                            </p>
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                            >
                                <ShoppingCart size={20} className="mr-2" />
                                Tambah ke Keranjang
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;
