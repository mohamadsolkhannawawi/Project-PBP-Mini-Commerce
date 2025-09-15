import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserProtectedRoute = () => {
    const { user, token, loading } = useAuth();

    if (loading) {
        return <div>Memeriksa otentikasi...</div>;
    }

    // Jika tidak ada token (belum login), arahkan ke halaman login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Jika pengguna adalah admin, arahkan ke dashboard admin
    if (user?.role === 'admin') {
        return <Navigate to="/admin/products" replace />;
    }

    // Jika pengguna adalah user biasa, izinkan akses
    return <Outlet />;
};

export default UserProtectedRoute;