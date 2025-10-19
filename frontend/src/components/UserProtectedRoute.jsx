// frontend/src/components/UserProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Route guard for user-only routes (not admin)
const UserProtectedRoute = () => {
    const { user, token, loading } = useAuth();

    // Show loading while checking authentication
    if (loading) {
        return <div>Memeriksa otentikasi...</div>;
    }

    // Redirect to login if not authenticated
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Redirect admin users to admin panel
    if (user?.role === 'admin') {
        return <Navigate to="/admin/products" replace />;
    }

    return <Outlet />;
};

export default UserProtectedRoute;
