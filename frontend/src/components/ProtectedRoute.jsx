// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Route guard for protected and admin-only routes
const ProtectedRoute = ({ adminOnly = false }) => {
    const { user, token, loading } = useAuth();

    if (loading) {
        return <div>Memeriksa otentikasi...</div>;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
