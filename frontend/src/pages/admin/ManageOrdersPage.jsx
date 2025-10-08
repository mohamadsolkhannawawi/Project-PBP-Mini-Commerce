import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../../api/axiosClient';
import OrdersTable from '../../components/admin/OrdersTable';
import { useToast } from '../../contexts/ToastContext';

function ManageOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusLoading, setStatusLoading] = useState({});

    const [searchOrder, setSearchOrder] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc',
    });
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const { showSuccess, showError, showLoading, updateToast } = useToast();

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/admin/orders');
            setOrders(response.data);
            setError(null);
        } catch (err) {
            setError(
                'Gagal memuat pesanan. Pastikan Anda login sebagai admin.'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setStatusLoading(prev => ({ ...prev, [orderId]: true }));
            const toastId = showLoading('Memperbarui status pesanan...');
            
            await axiosClient.put(`/admin/orders/${orderId}`, {
                status: newStatus,
            });
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId
                        ? { ...order, status: newStatus }
                        : order
                )
            );
            
            updateToast(toastId, 'Status pesanan berhasil diperbarui!', 'success');
        } catch (err) {
            showError('Gagal memperbarui status. Silakan coba lagi.');
            fetchOrders();
        } finally {
            setStatusLoading(prev => ({ ...prev, [orderId]: false }));
        }
    };

    let filteredOrders = orders.filter(
        (order) =>
            order.order_number &&
            order.order_number.toLowerCase().includes(searchOrder.toLowerCase())
    );
    if (statusFilter) {
        filteredOrders = filteredOrders.filter(
            (order) => order.status === statusFilter
        );
    }

    if (sortConfig.key) {
        filteredOrders = [...filteredOrders].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];
            if (typeof aValue === 'string') aValue = aValue.toLowerCase();
            if (typeof bValue === 'string') bValue = bValue.toLowerCase();
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = filteredOrders.slice(
        indexOfFirstOrder,
        indexOfLastOrder
    );
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    if (loading)
        return (
            <div className="p-8 text-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-64 bg-blue-100 rounded mb-4"></div>
                    <div className="h-4 w-48 bg-blue-100 rounded"></div>
                </div>
                <p className="mt-4 text-blue-600 font-medium">Memuat data pesanan...</p>
            </div>
        );
    if (error)
        return (
            <div className="text-red-600 bg-red-50 p-6 rounded-lg border border-red-200 shadow-sm my-4">
                <p className="font-semibold">{error}</p>
                <button 
                    onClick={fetchOrders}
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                    Coba Lagi
                </button>
            </div>
        );

    const statusOptions = Array.from(
        new Set(orders.map((order) => order.status))
    ).filter(Boolean);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 p-6">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-800">
                            Manajemen Pesanan
                        </h1>
                        <p className="text-blue-600 mt-2 font-medium">
                            Total Pesanan: {filteredOrders.length}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Cari No. Pesanan..."
                            value={searchOrder}
                            onChange={(e) => {
                                setSearchOrder(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border border-blue-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                            style={{ minWidth: 220 }}
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border border-blue-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white w-full sm:w-auto"
                        >
                            <option value="">Semua Status</option>
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() +
                                        status.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-blue-100 shadow-sm">
                    <OrdersTable
                        orders={currentOrders}
                        indexOfFirstOrder={indexOfFirstOrder}
                        handleStatusChange={handleStatusChange}
                        setSortConfig={setSortConfig}
                        sortConfig={sortConfig}
                    />
                </div>

                <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-3 mt-6">
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 w-full sm:w-auto"
                    >
                        Sebelumnya
                    </button>
                    <span className="mx-4 text-sm font-medium text-blue-800">
                        Halaman {currentPage} dari {totalPages || 1}
                    </span>
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 w-full sm:w-auto"
                    >
                        Selanjutnya
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ManageOrdersPage;
