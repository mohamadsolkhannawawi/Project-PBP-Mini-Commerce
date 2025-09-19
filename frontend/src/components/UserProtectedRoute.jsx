import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserProtectedRoute = () => {
    const { user, token, loading } = useAuth();

    if (loading) {
        return <div>Memeriksa otentikasi...</div>;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role === 'admin') {
        return <Navigate to="/admin/products" replace />;
    }

    return <Outlet />;
};

export default UserProtectedRoute;
