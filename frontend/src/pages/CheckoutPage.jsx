import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { getProductImageUrl } from '../utils/imageUtils';
import { useToast } from '../contexts/ToastContext';

function CheckoutPage() {
    const { fetchCart } = useCart();
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { showSuccess, showError, showLoading, updateToast } = useToast();

    const items = location.state?.items;

    if (!items || items.length === 0) {
        return <Navigate to="/keranjang" replace />;
    }

    const subtotal = items.reduce((total, item) => {
        const price = parseFloat(item.product.price);
        return total + price * item.quantity;
    }, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!address) {
            setError('Alamat pengiriman wajib diisi.');
            return;
        }
        
        const toastId = showLoading('Memproses pesanan...');
        setLoading(true);
        setError('');

        const selectedCartItemIds = items.map((item) => item.id);

        try {
            await axiosClient.post('/checkout', {
                address_text: address,
                cart_item_ids: selectedCartItemIds,
            });
            
            updateToast(toastId, 'Pesanan berhasil dibuat! Terima kasih telah berbelanja.', 'success');
            
            await fetchCart();
            
            setTimeout(() => {
                navigate('/');
            }, 1500);
            
        } catch (err) {
            console.error('Gagal checkout:', err);
            const errorMessage = err.response?.data?.message || 'Gagal memproses pesanan. Silakan coba lagi.';
            
            updateToast(toastId, errorMessage, 'error');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-montserrat py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
                    <div>
                        <form onSubmit={handleSubmit}>
                            <h1 className="text-3xl font-bold mb-6 text-black">
                                Detail Alamat
                            </h1>

                            {error && (
                                <p className="text-red-500 mb-4 text-sm">
                                    {error}
                                </p>
                            )}

                            <div className="mb-2">
                                <label className="block text-sm text-gray-700 mb-2">
                                    No. Telepon & Alamat Lengkap Penerima
                                </label>
                                <textarea
                                    className="w-full border border-gray-400 rounded-md p-3 text-sm focus:outline-none focus:border-gray-600"
                                    rows="7"
                                    placeholder="(08XXXXXXXXXX, Jalan, Kelurahan, Kecamatan, Kota, Kode Pos)"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    style={{
                                        maxWidth: '537px',
                                        minHeight: '180px',
                                    }}
                                ></textarea>
                            </div>
                        </form>
                    </div>

                    <div
                        className="rounded-lg p-6 shadow-lg"
                        style={{
                            background:
                                'linear-gradient(180deg, #E8E8E8 0%, #FFFFFF 30%)',
                            maxWidth: '654px',
                        }}
                    >
                        <div className="space-y-4">
                            {items.map((item) => {
                                const imageUrl = getProductImageUrl(
                                    item.product
                                );

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-lg p-4 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-black flex items-center justify-center flex-shrink-0">
                                                <img
                                                    src={imageUrl}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover rounded-md"
                                                    onError={(e) => {
                                                        e.currentTarget.onerror =
                                                            null;
                                                        e.currentTarget.src =
                                                            '/no-image.webp';
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-black text-base">
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-sm text-gray-700">
                                                    Kuantitas : {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="font-semibold text-black text-lg">
                                            Rp
                                            {new Intl.NumberFormat(
                                                'id-ID'
                                            ).format(
                                                item.product.price *
                                                    item.quantity
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-700">
                                    <span>
                                        Subtotal • {items.length} Produk
                                    </span>
                                </div>
                                <div className="border-t border-gray-400 pt-3 flex justify-between items-center">
                                    <span className="font-medium text-black">
                                        Total Pembayaran
                                    </span>
                                    <span className="font-bold text-black text-xl">
                                        Rp
                                        {new Intl.NumberFormat('id-ID').format(
                                            subtotal
                                        )}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading || items.length === 0}
                                className={`w-full py-4 text-white font-semibold rounded-lg transition-all mt-6 ${
                                    loading ? 'opacity-75 cursor-not-allowed' : 'hover:brightness-110'
                                }`}
                                style={{ backgroundColor: '#1B263B' }}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Memproses Pesanan...
                                    </div>
                                ) : (
                                    'Order Sekarang'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;