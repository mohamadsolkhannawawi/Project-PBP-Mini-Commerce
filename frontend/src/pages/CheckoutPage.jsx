import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

function CheckoutPage() {
    const { fetchCart } = useCart();
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const items = location.state?.items;

    if (!items || items.length === 0) {
        return <Navigate to="/cart" replace />;
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
        setLoading(true);
        setError('');

        const selectedCartItemIds = items.map((item) => item.id);

        try {
            await axiosClient.post('/checkout', {
                address_text: address,
                cart_item_ids: selectedCartItemIds,
            });
            alert('Pesanan berhasil dibuat!');
            await fetchCart();
            navigate('/');
        } catch (err) {
            console.error('Gagal checkout:', err);
            setError(
                err.response?.data?.message ||
                    'Gagal memproses pesanan. Silakan coba lagi.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <form
                    onSubmit={handleSubmit}
                    className="lg:col-span-2 bg-white p-6 rounded-lg shadow"
                >
                    <h2 className="text-xl font-bold mb-4">
                        Alamat Pengiriman
                    </h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <textarea
                        className="w-full p-2 border rounded"
                        rows="4"
                        placeholder="Masukkan alamat lengkap Anda, termasuk kota dan kode pos."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    ></textarea>
                    <button
                        type="submit"
                        disabled={loading || items.length === 0}
                        className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Memproses...' : 'Buat Pesanan'}
                    </button>
                </form>

                <div className="bg-gray-100 p-6 rounded-lg h-fit shadow">
                    <h2 className="text-xl font-bold mb-4">
                        Ringkasan Pesanan
                    </h2>
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between text-sm mb-2"
                        >
                            <span>
                                {item.product.name} x {item.quantity}
                            </span>
                            <span>
                                Rp{' '}
                                {new Intl.NumberFormat('id-ID').format(
                                    item.product.price * item.quantity
                                )}
                            </span>
                        </div>
                    ))}
                    <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>
                            Rp {new Intl.NumberFormat('id-ID').format(subtotal)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
