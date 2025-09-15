import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Komponen ini akan membungkus rute yang ingin kita lindungi
const ProtectedRoute = ({ adminOnly = false }) => {
	const { user, token, loading } = useAuth();

	// Sambil menunggu verifikasi token, jangan render apa-apa atau tampilkan loading
	if (loading) {
		return <div>Memeriksa otentikasi...</div>;
	}

	// Jika tidak ada token (belum login), arahkan ke halaman login
	if (!token) {
		return <Navigate to="/login" replace />;
	}

	// Jika rute ini hanya untuk admin, periksa peran pengguna
	if (adminOnly && user?.role !== "admin") {
		// Jika bukan admin, arahkan ke halaman utama
		return <Navigate to="/" replace />;
	}

	// Jika semua pengecekan lolos, tampilkan konten halaman (misalnya AdminLayout)
	return <Outlet />;
};

export default ProtectedRoute;
