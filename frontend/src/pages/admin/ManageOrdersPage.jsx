import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../../api/axiosClient';

function ManageOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/admin/orders');
            setOrders(response.data);
            setError(null);
        } catch (err) {
            setError('Gagal memuat pesanan. Pastikan Anda login sebagai admin.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axiosClient.put(`/admin/orders/${orderId}`, { status: newStatus });
            // Perbarui state secara lokal untuk responsivitas UI instan
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
            alert('Status pesanan berhasil diperbarui.');
        } catch (err) {
            console.error('Gagal memperbarui status pesanan:', err);
            alert('Gagal memperbarui status. Silakan coba lagi.');
            // Jika gagal, muat ulang data dari server untuk konsistensi
            fetchOrders();
        }
    };

    if (loading) return <div>Memuat data pesanan...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Manajemen Pesanan</h1>
            
            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No. Pesanan</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pelanggan</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.order_number}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.user.name}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">Rp {new Intl.NumberFormat('id-ID').format(order.total)}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(order.created_at).toLocaleDateString('id-ID')}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <select 
                                        value={order.status} 
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="border border-gray-300 rounded-md p-1"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="diproses">Diproses</option>
                                        <option value="dikirim">Dikirim</option>
                                        <option value="selesai">Selesai</option>
                                        <option value="batal">Batal</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManageOrdersPage;
