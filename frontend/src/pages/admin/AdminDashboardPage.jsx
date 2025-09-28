import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';
import { Home, ShoppingCart, Users, Package } from 'lucide-react';

const kpiIcons = {
    totalRevenue: <ShoppingCart className="w-8 h-8 text-[#F07167]" />,
    totalOrders: <Package className="w-8 h-8 text-[#F07167]" />,
    totalProducts: <Home className="w-8 h-8 text-[#F07167]" />,
    totalCustomers: <Users className="w-8 h-8 text-[#F07167]" />,
};

const kpiLabels = {
    totalRevenue: 'Total Revenue',
    totalOrders: 'Total Orders',
    totalProducts: 'Total Products',
    totalCustomers: 'Total Customers',
};

export default function AdminDashboardPage() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosClient
            .get('/admin/dashboard')
            .then((res) => {
                setDashboard(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading)
        return <div className="p-8 text-center">Loading dashboard...</div>;
    if (!dashboard)
        return (
            <div className="p-8 text-center text-red-500">
                Failed to load dashboard data.
            </div>
        );

    const { kpi, recentOrders, salesOverTime, topSellingProducts } = dashboard;

    return (
        <div className="p-6 bg-[#EAEAEA] min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-[#1B263B]">
                Admin Dashboard
            </h1>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {Object.entries(kpi).map(([key, value]) => (
                    <div
                        key={key}
                        className="bg-[#1B263B] rounded-xl p-6 flex flex-col items-center text-white shadow"
                    >
                        {kpiIcons[key]}
                        <div className="mt-2 text-lg font-semibold">
                            {kpiLabels[key]}
                        </div>
                        <div className="mt-1 text-2xl font-bold">
                            {key === 'totalRevenue'
                                ? `Rp ${Number(value).toLocaleString('id-ID')}`
                                : value}
                        </div>
                    </div>
                ))}
            </div>
            {/* Sales Chart */}
            <div className="bg-white rounded-xl p-6 mb-8 shadow">
                <h2 className="text-xl font-bold mb-4 text-[#415A77]">
                    Sales (Last 7 Days)
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={salesOverTime} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#F07167"
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            {/* Top Selling Products & Recent Orders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Selling Products */}
                <div className="bg-white rounded-xl p-6 shadow">
                    <h2 className="text-lg font-bold mb-4 text-[#415A77]">
                        Top Selling Products
                    </h2>
                    <ul>
                        {topSellingProducts.length === 0 && (
                            <li className="text-gray-500">No data.</li>
                        )}
                        {topSellingProducts.map((product) => (
                            <li
                                key={product.id}
                                className="flex justify-between py-2 border-b last:border-b-0"
                            >
                                <span>{product.name}</span>
                                <span className="font-bold">
                                    {product.items_sold ?? 0} sold
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Recent Orders */}
                <div className="bg-white rounded-xl p-6 shadow">
                    <h2 className="text-lg font-bold mb-4 text-[#415A77]">
                        Recent Orders
                    </h2>
                    <ul>
                        {recentOrders.length === 0 && (
                            <li className="text-gray-500">No recent orders.</li>
                        )}
                        {recentOrders.map((order) => (
                            <li
                                key={order.id}
                                className="flex justify-between py-2 border-b last:border-b-0"
                            >
                                <span>#{order.order_number}</span>
                                <span>{order.user?.name ?? 'User'}</span>
                                <span className="font-bold text-[#F07167]">
                                    Rp{' '}
                                    {Number(order.total).toLocaleString(
                                        'id-ID'
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
