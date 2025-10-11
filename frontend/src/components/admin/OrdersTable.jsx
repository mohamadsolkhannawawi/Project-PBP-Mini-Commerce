import React, { useState, useEffect, useRef } from 'react';

function OrdersTable({
    orders,
    indexOfFirstOrder,
    handleStatusChange,
    setSortConfig,
    sortConfig,
}) {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({
        top: 0,
        left: 0,
    });
    const badgeRefs = useRef({});

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.status-dropdown')) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleBadgeClick = (orderId) => {
        if (openDropdown === orderId) {
            setOpenDropdown(null);
            return;
        }

        const badgeElement = badgeRefs.current[orderId];
        if (badgeElement) {
            const rect = badgeElement.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX,
            });
        }
        setOpenDropdown(orderId);
    };

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

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'selesai':
                return 'text-green-800 bg-green-100';
            case 'batal':
                return 'text-red-800 bg-red-100';
            case 'pending':
                return 'text-yellow-800 bg-yellow-100';
            case 'diproses':
                return 'text-blue-800 bg-blue-100';
            case 'dikirim':
                return 'text-purple-800 bg-purple-100';
            default:
                return 'text-gray-800 bg-gray-100';
        }
    };

    const getStatusDotColor = (status) => {
        switch (status) {
            case 'selesai':
                return 'bg-green-500';
            case 'batal':
                return 'bg-red-500';
            case 'pending':
                return 'bg-yellow-500';
            case 'diproses':
                return 'bg-blue-500';
            case 'dikirim':
                return 'bg-purple-500';
            default:
                return 'bg-gray-500';
        }
    };

    const handleStatusClick = (orderId, newStatus) => {
        handleStatusChange(orderId, newStatus);
        setOpenDropdown(null);
    };

    return (
        <table className="min-w-full text-sm">
            <thead>
                <tr>
                    <th className="px-6 py-4 text-center text-sm font-medium text-white bg-[#415A77] rounded-l-md">
                        No.
                    </th>
                    <th
                        className="px-6 py-4 text-left text-sm font-medium text-white bg-[#415A77] cursor-pointer"
                        onClick={() => handleSort('order_number')}
                    >
                        No. Pesanan {renderSortArrow('order_number')}
                    </th>
                    <th
                        className="px-6 py-4 text-left text-sm font-medium text-white bg-[#415A77] cursor-pointer"
                        onClick={() => handleSort('user')}
                    >
                        Pelanggan {renderSortArrow('user')}
                    </th>
                    <th
                        className="px-6 py-4 text-left text-sm font-medium text-white bg-[#415A77] cursor-pointer"
                        onClick={() => handleSort('total')}
                    >
                        Total {renderSortArrow('total')}
                    </th>
                    <th
                        className="px-6 py-4 text-left text-sm font-medium text-white bg-[#415A77] cursor-pointer"
                        onClick={() => handleSort('created_at')}
                    >
                        Tanggal {renderSortArrow('created_at')}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-white bg-[#415A77] rounded-r-md">
                        Status
                    </th>
                </tr>
            </thead>
            <tbody className="text-gray-700 text-xs">
                {orders.map((order, index) => (
                    <tr
                        key={order.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                    >
                        <td className="px-6 py-4 align-middle text-center">
                            {indexOfFirstOrder + index + 1}
                        </td>
                        <td className="px-6 py-4 align-middle text-left">
                            {order.order_number}
                        </td>
                        <td className="px-6 py-4 align-middle text-left">
                            {order.user?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 align-middle text-left">
                            Rp{' '}
                            {new Intl.NumberFormat('id-ID').format(order.total)}
                        </td>
                        <td className="px-6 py-4 align-middle text-left">
                            {new Date(order.created_at).toLocaleDateString(
                                'id-ID'
                            )}
                        </td>
                        <td className="px-6 py-4 align-middle text-center">
                            <div className="relative inline-block status-dropdown">
                                <span
                                    ref={(el) =>
                                        (badgeRefs.current[order.id] = el)
                                    }
                                    className={`inline-flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-md cursor-pointer hover:opacity-80 ${getStatusBadgeColor(
                                        order.status
                                    )}`}
                                    onClick={() => handleBadgeClick(order.id)}
                                >
                                    <span
                                        className={`w-2 h-2 rounded-full ${getStatusDotColor(
                                            order.status
                                        )}`}
                                    />
                                    {order.status.charAt(0).toUpperCase() +
                                        order.status.slice(1)}
                                    <svg
                                        className="w-3 h-3 ml-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </span>
                                {openDropdown === order.id && (
                                    <div
                                        className="fixed bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-max"
                                        style={{
                                            top: `${dropdownPosition.top}px`,
                                            left: `${dropdownPosition.left}px`,
                                        }}
                                    >
                                        <button
                                            onClick={() =>
                                                handleStatusClick(
                                                    order.id,
                                                    'pending'
                                                )
                                            }
                                            className="block w-full text-left px-3 py-2 text-xs hover:bg-yellow-50 text-yellow-800 first:rounded-t-md"
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                                                Pending
                                            </span>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleStatusClick(
                                                    order.id,
                                                    'diproses'
                                                )
                                            }
                                            className="block w-full text-left px-3 py-2 text-xs hover:bg-blue-50 text-blue-800"
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                                Diproses
                                            </span>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleStatusClick(
                                                    order.id,
                                                    'dikirim'
                                                )
                                            }
                                            className="block w-full text-left px-3 py-2 text-xs hover:bg-purple-50 text-purple-800"
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-purple-500" />
                                                Dikirim
                                            </span>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleStatusClick(
                                                    order.id,
                                                    'selesai'
                                                )
                                            }
                                            className="block w-full text-left px-3 py-2 text-xs hover:bg-green-50 text-green-800"
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                                Selesai
                                            </span>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleStatusClick(
                                                    order.id,
                                                    'batal'
                                                )
                                            }
                                            className="block w-full text-left px-3 py-2 text-xs hover:bg-red-50 text-red-800 last:rounded-b-md"
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                                Batal
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default OrdersTable;