import React from 'react';

function OrdersTable({
    orders,
    indexOfFirstOrder,
    handleStatusChange,
    setSortConfig,
    sortConfig,
}) {
    const renderSortArrow = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? '▲' : '▼';
        }
        return '';
    };

    const handleSort = (key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction:
                prevConfig.key === key && prevConfig.direction === 'asc'
                    ? 'desc'
                    : 'asc',
        }));
    };

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden flex-1">
            <table className="min-w-full text-sm">
                <thead className="bg-[#4D809E] text-white">
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">
                            No.
                        </th>
                        <th
                            className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('order_number')}
                        >
                            No. Pesanan {renderSortArrow('order_number')}
                        </th>
                        <th
                            className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('user')}
                        >
                            Pelanggan {renderSortArrow('user')}
                        </th>
                        <th
                            className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('total')}
                        >
                            Total {renderSortArrow('total')}
                        </th>
                        <th
                            className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('created_at')}
                        >
                            Tanggal {renderSortArrow('created_at')}
                        </th>
                        <th
                            className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('status')}
                        >
                            Status {renderSortArrow('status')}
                        </th>
                    </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                    {orders.map((order, index) => (
                        <tr
                            key={order.id}
                            className="border-b border-gray-200 hover:bg-gray-50"
                        >
                            <td className="px-3 py-2">
                                {indexOfFirstOrder + index + 1}
                            </td>
                            <td className="px-3 py-2">{order.order_number}</td>
                            <td className="px-3 py-2">
                                {order.user?.name || 'N/A'}
                            </td>
                            <td className="px-3 py-2">
                                Rp{' '}
                                {new Intl.NumberFormat('id-ID').format(
                                    order.total
                                )}
                            </td>
                            <td className="px-3 py-2">
                                {new Date(order.created_at).toLocaleDateString(
                                    'id-ID'
                                )}
                            </td>
                            <td className="px-3 py-2">
                                <select
                                    value={order.status}
                                    onChange={(e) =>
                                        handleStatusChange(
                                            order.id,
                                            e.target.value
                                        )
                                    }
                                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
    );
}

export default OrdersTable;
