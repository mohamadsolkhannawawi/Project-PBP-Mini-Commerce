import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from '../components/SearchBar';
import NotificationBell from '../components/NotificationBell';
import AdminSidebar from '../components/admin/AdminSidebar';
import axiosClient from '../api/axiosClient';
import { useState } from 'react';

function AdminLayout() {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const [productMessage, setProductMessage] = useState(null);

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (loading || !user || user.role !== 'admin') {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700">
                        Memverifikasi sesi admin...
                    </p>
                    <p className="text-gray-500">
                        Anda akan diarahkan jika sesi tidak valid.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <AdminSidebar user={user} handleLogout={handleLogout} />

            <main className="flex-1 p-6 overflow-y-auto bg-[#D3D7DD] min-h-0">
                <header className="flex items-center justify-end mb-6 space-x-4">
                    <div className="w-full max-w-md">
                        <SearchBar
                            onSelect={(product) =>
                                navigate(
                                    `/admin/dashboard?product_id=${product.id}`
                                )
                            }
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
                                    if (arr.length === 1) {
                                        navigate(
                                            `/admin/dashboard?product_id=${arr[0].id}`
                                        );
                                        setProductMessage(
                                            `Menampilkan hasil untuk produk ${arr[0].name}`
                                        );
                                        setTimeout(
                                            () => setProductMessage(null),
                                            4000
                                        );
                                    } else {
                                        navigate(
                                            `/admin/products?search=${encodeURIComponent(
                                                q
                                            )}`
                                        );
                                    }
                                } catch (err) {
                                    console.error('Search submit error', err);
                                    navigate(
                                        `/admin/products?search=${encodeURIComponent(
                                            q
                                        )}`
                                    );
                                }
                            }}
                            onClear={() => {
                                // clear product filter by navigating back to dashboard root
                                // use replace so the product_id query isn't left in history
                                navigate('/admin/dashboard', { replace: true });
                            }}
                        />
                    </div>
                    <NotificationBell />
                </header>
                {productMessage && (
                    <div className="mb-4 text-center text-sm text-green-700">
                        {productMessage}
                    </div>
                )}
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
