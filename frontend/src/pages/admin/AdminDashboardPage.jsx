import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import NotificationBell from '../../components/NotificationBell';
import ProfileMenu from '../../components/ProfileMenu';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

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
    totalRevenue: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-[#1B263B]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect
                x="1"
                y="4"
                width="22"
                height="16"
                rx="2"
                ry="2"
                fill="none"
            />
            {/* centered dollar sign */}
            <text
                x="12"
                y="15"
                textAnchor="middle"
                fontSize="8"
                fontWeight="700"
                fill="currentColor"
            >
                $
            </text>
        </svg>
    ),
    totalOrders: <ShoppingCart className="w-12 h-12 text-[#1B263B]" />,
    totalProducts: <Home className="w-12 h-12 text-[#1B263B]" />,
    sold: <Package className="w-12 h-12 text-[#1B263B]" />,
    totalCustomers: <Users className="w-12 h-12 text-[#1B263B]" />,
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
    const navigate = useNavigate();

    const { user } = useAuth();

    const getQuery = (name) => {
        const params = new URLSearchParams(location.search);
        return params.get(name);
    };

    useEffect(() => {
        axiosClient
            .get('/admin/dashboard')
            .then((res) => {
                const payload = res.data?.data ?? res.data ?? {};
                setDashboard(payload);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        const productId = getQuery('product_id');
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
                const payload = res.data?.data ?? res.data ?? res;
                if (mounted) setProductSummary(payload);
            } catch (err) {
                console.error('Failed to load product summary', err);
                if (mounted) setProductSummary(null);
            }
        };
        fetchSummary();
        return () => (mounted = false);
    }, [location.search]);

    useEffect(() => {
        const handler = () => setProductSummary(null);
        window.addEventListener('clearProductSummary', handler);
        return () => window.removeEventListener('clearProductSummary', handler);
    }, []);

    if (loading)
        return <LoadingSpinner text="Memuat dashboard..." size="lg" className="py-12" />;
    if (!dashboard)
        return (
            <div className="p-8 text-center text-red-500">
                Failed to load dashboard data.
            </div>
        );

    const {
        kpi = {},
        recentOrders = [],
        salesOverTime = [],
        topSellingProducts = [],
    } = dashboard || {};

    const chartData =
        productSummary?.sales_over_time ||
        productSummary?.salesOverTime ||
        productSummary?.sales ||
        salesOverTime;

    const isSearching = Boolean(
        getQuery('product_id') || window.history?.state?.usr?.product_not_found
    );

    return (
        <div className="p-6 bg-[#D3D7DD] min-h-screen">
            {/* Dashboard top header: Welcome, centered search, notif + profile on right */}
            <div className="flex items-center justify-between -mt-10 mb-6">
                <div className="pl-0">
                    <div className="text-3xl font-bold text-[#1B263B] flex items-center">
                        <span className="mr-3">Welcome!</span>
                        <span
                            className="wave inline-block"
                            style={{
                                display: 'inline-block',
                                transformOrigin: '70% 70%',
                            }}
                        >
                            👋
                        </span>
                    </div>
                    <div className="text-sm text-gray-500">
                        <span>Welcome back, </span>
                        <p className="font-bold inline">
                            {user?.name || 'Admin'}
                        </p>
                    </div>
                </div>

                <div className="flex-1 flex justify-center px-4">
                    <div className="w-full max-w-2xl mt-2">
                        <SearchBar
                            onSelect={(product) => {
                                navigate(
                                    `/admin/dashboard?product_id=${product.id}`,
                                    {
                                        state: {
                                            admin_product_selected: String(
                                                product.id
                                            ),
                                        },
                                    }
                                );
                            }}
                            onSubmit={async (q) => {
                                try {
                                    const res = await axiosClient.get(
                                        `/products?search=${encodeURIComponent(
                                            q
                                        )}&limit=10&all=1`
                                    );
                                    let arr =
                                        res.data?.data?.data ||
                                        res.data?.data ||
                                        res.data;
                                    arr = Array.isArray(arr) ? arr : [];
                                    const trimmed = (q || '')
                                        .trim()
                                        .toLowerCase();
                                    const exact = arr.find(
                                        (p) =>
                                            p.name &&
                                            p.name.toLowerCase() === trimmed
                                    );

                                    if (exact) {
                                        navigate(
                                            `/admin/dashboard?product_id=${exact.id}`,
                                            {
                                                state: {
                                                    admin_product_selected:
                                                        String(exact.id),
                                                },
                                            }
                                        );
                                    } else if (arr.length === 1) {
                                        navigate(
                                            `/admin/dashboard?product_id=${arr[0].id}`,
                                            {
                                                state: {
                                                    admin_product_selected:
                                                        String(arr[0].id),
                                                },
                                            }
                                        );
                                    } else {
                                        navigate('/admin/dashboard', {
                                            state: {
                                                product_not_found: true,
                                                search_query: q,
                                            },
                                        });
                                    }
                                } catch (err) {
                                    console.error('Search submit error', err);
                                    navigate('/admin/dashboard', {
                                        state: {
                                            product_not_found: true,
                                            search_query: q,
                                        },
                                    });
                                }
                            }}
                            onClear={() => {
                                try {
                                    sessionStorage.removeItem(
                                        'admin_product_selected'
                                    );
                                } catch (e) {}
                                try {
                                    window.dispatchEvent(
                                        new CustomEvent('clearProductSummary')
                                    );
                                } catch (e) {}
                                navigate('/admin/dashboard', { replace: true });
                            }}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4 mt-2">
                    <NotificationBell />
                    <ProfileMenu />
                </div>
            </div>

            <style>{`@keyframes wave {0%{transform:rotate(0deg)}15%{transform:rotate(14deg)}30%{transform:rotate(-8deg)}40%{transform:rotate(14deg)}50%{transform:rotate(-4deg)}60%{transform:rotate(10deg)}70%{transform:rotate(0deg)}100%{transform:rotate(0deg)}} .wave{animation:wave 2s infinite;}`}</style>

            <h1 className="text-3xl font-bold mb-4 text-[#1B263B]">
                Admin Dashboard
            </h1>

            {/* Show product summary bar or 'not found' based on navigation state or productSummary */}
            {window.history.state &&
            window.history.state.usr &&
            window.history.state.usr.product_not_found ? (
                <div className="flex items-center justify-between bg-white rounded-md p-3 mb-6 shadow">
                    <div>
                        <div className="text-sm text-gray-600">
                            Viewing product
                        </div>
                        <div className="text-lg font-semibold text-[#1B263B]">
                            Produk tidak ditemukan
                        </div>
                    </div>
                </div>
            ) : productSummary ? (
                <div className="flex items-center justify-between bg-white rounded-md p-3 mb-6 shadow">
                    <div>
                        <div className="text-sm text-gray-600">
                            Viewing product
                        </div>
                        <div className="text-lg font-semibold text-[#1B263B]">
                            {productSummary.product_name}
                        </div>
                    </div>
                </div>
            ) : null}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
                        else if (key === 'totalProducts') displayValue = 1;
                        else if (key === 'totalCustomers')
                            displayValue = productSummary.total_buyers ?? 0;
                    }

                    return (
                        <div
                            key={key}
                            className="bg-[#415A77] rounded-xl p-4 flex flex-col items-center text-white shadow"
                        >
                            {kpiIcons[key]}
                            <div className="mt-1 text-sm font-semibold">
                                {kpiLabels[key]}
                            </div>
                            <div className="mt-1 text-xl font-bold">
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

            {/* Sales Chart (hidden while admin is actively searching) */}
            {!isSearching && (
                <div className="bg-white rounded-xl p-6 mb-8 shadow">
                    <h2 className="text-xl font-bold mb-4 text-[#415A77]">
                        Sales (Last 7 Days)
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        {(!chartData || chartData.length === 0) &&
                        productSummary ? (
                            <div className="p-6 text-sm text-gray-500">
                                No sales data available for this product.
                            </div>
                        ) : (
                            <LineChart
                                data={chartData}
                                margin={{
                                    top: 5,
                                    right: 20,
                                    left: 30,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    stroke="#eee"
                                    strokeDasharray="5 5"
                                />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#415A77"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            )}
            {/* Top Selling Products & Recent Orders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow md:col-span-1">
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

                <div className="bg-white rounded-xl p-6 shadow md:col-span-2">
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
                                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                                >
                                    <span className="mr-4">
                                        #{order.order_number}
                                    </span>
                                    <span className="flex-1 px-4 text-left">
                                        {order.user?.name ?? 'User'}
                                    </span>
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
                                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                                >
                                    <span className="mr-4">
                                        #{order.order_number}
                                    </span>
                                    <span className="flex-1 px-4 text-left">
                                        {order.user?.name ?? 'User'}
                                    </span>
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