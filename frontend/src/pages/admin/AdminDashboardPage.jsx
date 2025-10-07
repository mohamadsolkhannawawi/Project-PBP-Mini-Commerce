import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { useLocation } from 'react-router-dom';

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
    totalRevenue: <ShoppingCart className="w-14 h-14 text-[#1B263B]" />,
    totalOrders: <Package className="w-14 h-14 text-[#1B263B]" />,
    totalProducts: <Home className="w-14 h-14 text-[#1B263B]" />,
    sold: <Package className="w-14 h-14 text-[#1B263B]" />,
    totalCustomers: <Users className="w-14 h-14 text-[#1B263B]" />,
};

const kpiLabels = {
    totalRevenue: 'Total Revenue',
    totalOrders: 'Total Orders',
    totalProducts: 'Total Products',
    sold: 'Sold',
    totalCustomers: 'Total Customers',
};

export default function AdminDashboardPage() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [productSummary, setProductSummary] = useState(null);
    const location = useLocation();

    const getQuery = (name) => {
        const params = new URLSearchParams(location.search);
        return params.get(name);
    };

    useEffect(() => {
        axiosClient
            .get('/admin/dashboard')
            .then((res) => {
                setDashboard(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        const productId = getQuery('product_id');
        // If there's no product_id in the query, clear any product-specific summary
        // so the dashboard shows global data again.
        if (!productId) {
            setProductSummary(null);
            return;
        }

        let mounted = true;
        const fetchSummary = async () => {
            try {
                const res = await axiosClient.get(
                    `/products/${productId}/summary_v2`
                );
                if (mounted) setProductSummary(res.data);
            } catch (err) {
                console.error('Failed to load product summary', err);
            }
        };
        fetchSummary();
        return () => (mounted = false);
    }, [location.search]);

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
        <div className="p-6 bg-[#D3D7DD] min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-[#1B263B]">
                Admin Dashboard
            </h1>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                {[
                    'totalRevenue',
                    'totalOrders',
                    'sold',
                    'totalProducts',
                    'totalCustomers',
                ].map((key) => {
                    let displayValue = kpi[key] ?? 0;
                    if (productSummary) {
                        if (key === 'totalRevenue')
                            displayValue = productSummary.revenue ?? 0;
                        else if (key === 'totalOrders')
                            displayValue =
                                productSummary.total_orders ??
                                productSummary.total_sold ??
                                0;
                        else if (key === 'sold')
                            displayValue = productSummary.total_sold ?? 0;
                        else if (key === 'totalProducts')
                            displayValue = 1; // when viewing a single product
                        else if (key === 'totalCustomers')
                            displayValue = productSummary.total_buyers ?? 0;
                    }

                    return (
                        <div
                            key={key}
                            className="bg-[#415A77] rounded-xl p-6 flex flex-col items-center text-white shadow"
                        >
                            {kpiIcons[key]}
                            <div className="mt-2 text-lg font-semibold">
                                {kpiLabels[key]}
                            </div>
                            <div className="mt-1 text-2xl font-bold">
                                {key === 'totalRevenue'
                                    ? `Rp ${Number(displayValue).toLocaleString(
                                          'id-ID'
                                      )}`
                                    : displayValue}
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Sales Chart */}
            <div className="bg-white rounded-xl p-6 mb-8 shadow">
                <h2 className="text-xl font-bold mb-4 text-[#415A77]">
                    Sales (Last 7 Days)
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart
                        data={salesOverTime}
                        margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
                    >
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
                {/* Top Selling Products or Top Buyers for product */}
                <div className="bg-white rounded-xl p-6 shadow">
                    <h2 className="text-lg font-bold mb-4 text-[#415A77]">
                        {productSummary ? 'Top Buyers' : 'Top Selling Products'}
                    </h2>
                    <ul>
                        {!productSummary && topSellingProducts.length === 0 && (
                            <li className="text-gray-500">No data.</li>
                        )}
                        {!productSummary &&
                            topSellingProducts.map((product) => (
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

                        {productSummary &&
                            productSummary.top_buyers &&
                            productSummary.top_buyers.length === 0 && (
                                <li className="text-gray-500">
                                    No buyers yet.
                                </li>
                            )}
                        {productSummary &&
                            productSummary.top_buyers &&
                            productSummary.top_buyers.map((b) => (
                                <li
                                    key={b.user_id}
                                    className="flex justify-between py-2 border-b last:border-b-0"
                                >
                                    <span>User #{b.user_id}</span>
                                    <span className="font-bold">
                                        {b.qty} pcs
                                    </span>
                                </li>
                            ))}
                    </ul>
                </div>
                {/* Recent Orders (global or for product) */}
                <div className="bg-white rounded-xl p-6 shadow">
                    <h2 className="text-lg font-bold mb-4 text-[#415A77]">
                        Recent Orders
                    </h2>
                    <ul>
                        {productSummary &&
                            productSummary.recent_orders &&
                            productSummary.recent_orders.length === 0 && (
                                <li className="text-gray-500">
                                    No recent orders for this product.
                                </li>
                            )}

                        {!productSummary && recentOrders.length === 0 && (
                            <li className="text-gray-500">No recent orders.</li>
                        )}

                        {productSummary &&
                            productSummary.recent_orders &&
                            productSummary.recent_orders.map((order) => (
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

                        {!productSummary &&
                            recentOrders.map((order) => (
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
