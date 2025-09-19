import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import SearchBar from '../components/SearchBar';
import AdminSidebar from '../components/admin/AdminSidebar';

function AdminLayout() {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

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

            <main className="flex-1 p-6 overflow-y-auto bg-[#FDFDFF]">
                {/* <header className="flex justify-end items-center mb-6">
                    <div className="w-full max-w-md">
                        <SearchBar />
                    </div>
                </header> */}
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
