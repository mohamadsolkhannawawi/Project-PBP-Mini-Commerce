import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../../api/axiosClient';
import OrdersTable from '../../components/admin/OrdersTable';

function ManageOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchOrder, setSearchOrder] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc',
    });
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

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
            alert('Status pesanan berhasil diperbarui.');
        } catch (err) {
            alert('Gagal memperbarui status. Silakan coba lagi.');
            fetchOrders();
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
        return <div className="p-4 text-center">Memuat data pesanan...</div>;
    if (error)
        return (
            <div className="text-red-500 bg-red-100 p-4 rounded-md">
                {error}
            </div>
        );

    const statusOptions = Array.from(
        new Set(orders.map((order) => order.status))
    ).filter(Boolean);

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#001F3F]">
                        Manajemen Pesanan
                    </h1>
                    <p className="text-gray-600 mt-3">
                        Total Pesanan: {filteredOrders.length}
                    </p>
                </div>
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Cari No. Pesanan..."
                        value={searchOrder}
                        onChange={(e) => {
                            setSearchOrder(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                        style={{ minWidth: 200 }}
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
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

            <OrdersTable
                orders={currentOrders}
                indexOfFirstOrder={indexOfFirstOrder}
                handleStatusChange={handleStatusChange}
                setSortConfig={setSortConfig}
                sortConfig={sortConfig}
            />

            <div className="w-full flex justify-center items-center mt-4 mb-8">
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-md disabled:opacity-50 mx-2"
                >
                    Back
                </button>
                <span className="mx-4 text-sm font-medium">
                    Halaman {currentPage} dari {totalPages}
                </span>
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-md disabled:opacity-50 mx-2"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default ManageOrdersPage;
