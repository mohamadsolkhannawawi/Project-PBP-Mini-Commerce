import React, { useEffect, useState } from 'react';
import ReviewForm from '../components/ReviewForm';
import StarRating from '../components/StarRating';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchOrderBar from '../components/SearchOrderBar';
import { useNavigate } from 'react-router-dom';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeStatus, setActiveStatus] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                let url = '/orders';
                if (activeStatus !== 'all') {
                    url += `?status=${activeStatus}`;
                }
                const res = await axiosClient.get(url);
                setOrders(res.data.data || []);
                setFilteredOrders(res.data.data || []);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
        setSearchQuery('');
    }, [activeStatus]);

    useEffect(() => {
        setSearchQuery('');
    }, [activeStatus]);

    const handleReviewSuccess = (review) => {
        setSelectedItem(null);
        window.location.reload();
    };

    const [searchQuery, setSearchQuery] = useState('');
    const handleSearch = (query) => {
        setSearchQuery(query);
        let base = orders;
        if (activeStatus !== 'all') {
            base = orders.filter((order) => order.status === activeStatus);
        }
        if (!query) {
            setFilteredOrders(base);
            return;
        }
        const lowerQuery = query.toLowerCase();
        setFilteredOrders(
            base.filter(
                (order) =>
                    order.order_number.toLowerCase().includes(lowerQuery) ||
                    order.items.some((item) =>
                        item.product_name.toLowerCase().includes(lowerQuery)
                    )
            )
        );
    };

    const statusTabs = [
        { key: 'all', label: 'Semua' },
        { key: 'pending', label: 'Pending' },
        { key: 'diproses', label: 'Diproses' },
        { key: 'dikirim', label: 'Dikirim' },
        { key: 'selesai', label: 'Selesai' },
        { key: 'batal', label: 'Batal' },
    ];

    return (
        <>
            <Navbar />
            <div className="max-w-3xl mx-auto py-8 px-4 min-h-[70vh]">
                <h1 className="text-2xl font-bold mb-6">Riwayat Pesanan</h1>
                <div className="flex gap-2 mb-6">
                    {statusTabs.map((tab) => (
                        <button
                            key={tab.key}
                            className={`px-4 py-2 rounded font-semibold border transition-colors ${
                                activeStatus === tab.key
                                    ? 'bg-[#1B263B] text-white'
                                    : 'bg-gray-100 text-[#1B263B] hover:bg-gray-200'
                            }`}
                            onClick={() => setActiveStatus(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <SearchOrderBar onSearch={handleSearch} />
                <button
                    className="mb-6 bg-gray-100 text-[#1B263B] px-4 py-2 rounded hover:bg-gray-200 font-semibold"
                    onClick={() => navigate('/')}
                >
                    Kembali ke Homepage
                </button>
                {loading && <div>Memuat...</div>}
                {error && <div className="text-red-500">{error}</div>}
                {filteredOrders.length === 0 && !loading && (
                    <div>
                        Tidak ada pesanan untuk kategori{' '}
                        <span className="font-semibold">
                            {
                                statusTabs.find((t) => t.key === activeStatus)
                                    ?.label
                            }
                        </span>
                        .
                    </div>
                )}
                {filteredOrders.map((order) => (
                    <div
                        key={order.id}
                        className="border rounded-lg mb-6 p-4 bg-white shadow"
                    >
                        <div className="font-semibold mb-2">
                            No. Invoice: {order.order_number}
                        </div>
                        <div className="mb-2">Status: {order.status}</div>
                        <div className="mb-2">Total: Rp{order.total}</div>
                        <div className="mb-2">Alamat: {order.address_text}</div>
                        <div className="mt-4">
                            <div className="font-semibold mb-2">Produk:</div>
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 border-b py-2"
                                >
                                    <div className="flex-1">
                                        <div className="font-medium">
                                            {item.product_name}
                                        </div>
                                        <div>Qty: {item.quantity}</div>
                                        <div>Harga: Rp{item.price}</div>
                                    </div>
                                    {item.review ? (
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs text-gray-500 mb-1">
                                                Review Terkirim
                                            </span>
                                            <StarRating
                                                rating={item.review.rating}
                                            />
                                        </div>
                                    ) : (
                                        order.status === 'selesai' && (
                                            <button
                                                className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                                                onClick={() =>
                                                    setSelectedItem({
                                                        productId:
                                                            item.product_id,
                                                        orderItemId: item.id,
                                                    })
                                                }
                                            >
                                                Tulis Review
                                            </button>
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {selectedItem && (
                    <ReviewForm
                        productId={selectedItem.productId}
                        orderItemId={selectedItem.orderItemId}
                        onSuccess={handleReviewSuccess}
                        onClose={() => setSelectedItem(null)}
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

export default OrderHistoryPage;