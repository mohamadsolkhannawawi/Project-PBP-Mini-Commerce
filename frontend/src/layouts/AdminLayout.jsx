import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from '../components/SearchBar';
import NotificationBell from '../components/NotificationBell';
import AdminSidebar from '../components/admin/AdminSidebar';
import axiosClient from '../api/axiosClient';

function AdminLayout() {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

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
                    {/* hide layout search/notification on dashboard and any products pages (the pages render their own header) */}
                    {/* use location so this reacts to route changes including query params */}
                    {(() => {
                        const hideOnPrefixes = ['/admin/dashboard', '/admin/products'];
                        const shouldShowHeader = !hideOnPrefixes.some((p) =>
                            location.pathname.startsWith(p)
                        );

                        if (!shouldShowHeader) return null;

                        return (
                            <div className="w-full max-w-md">
                                <SearchBar
                                onSelect={(product) => {
                                    // navigate and pass a short-lived navigation state so the dashboard
                                    // knows this navigation came from an active search/selection
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
                                        // prefer exact name match (case-insensitive)
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
                                            // single non-exact result: still show it
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
                                            // no exact match (either 0 results or multiple partial results)
                                            // show 'Produk tidak ditemukan' in the dashboard viewing area
                                            navigate('/admin/dashboard', {
                                                state: {
                                                    product_not_found: true,
                                                    search_query: q,
                                                },
                                            });
                                        }
                                    } catch (err) {
                                        console.error(
                                            'Search submit error',
                                            err
                                        );
                                        // network/search error -> show not found state in dashboard
                                        navigate('/admin/dashboard', {
                                            state: {
                                                product_not_found: true,
                                                search_query: q,
                                            },
                                        });
                                    }
                                }}
                                onClear={() => {
                                    // clear product filter by navigating back to dashboard root
                                    // use replace so the product_id query isn't left in history
                                    // clear the selected marker and navigate back to base dashboard
                                    try {
                                        sessionStorage.removeItem(
                                            'admin_product_selected'
                                        );
                                    } catch (e) {}
                                    navigate('/admin/dashboard', {
                                        replace: true,
                                    });
                                    // notify any dashboard listeners to clear product summary immediately
                                    try {
                                        window.dispatchEvent(
                                            new CustomEvent(
                                                'clearProductSummary'
                                            )
                                        );
                                    } catch (e) {
                                        // ignore if environment doesn't support CustomEvent
                                    }
                                }}
                            />
                        </div>
                        );
                    })()}
                    {(() => {
                        const hideOnPrefixes = ['/admin/dashboard', '/admin/products'];
                        const shouldShowHeader = !hideOnPrefixes.some((p) =>
                            location.pathname.startsWith(p)
                        );

                        return shouldShowHeader ? <NotificationBell /> : null;
                    })()}
                </header>
                {/* productMessage removed: dashboard shows viewing product bar when applicable */}
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
