import React, { createContext, useState, useContext, useEffect } from "react";
import axiosClient from "../api/axiosClient";

// Membuat Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

	useEffect(() => {
		// Jika ada token, coba ambil data pengguna
		if (token) {
			// Anda bisa menambahkan endpoint /api/user di Laravel untuk mengambil data user
			// Untuk sekarang, kita asumsikan token valid jika ada.
			// Di aplikasi nyata, Anda harus memverifikasi token ini ke server.
		}
	}, [token]);

	const setAuthToken = (newToken) => {
		setToken(newToken);
		if (newToken) {
			localStorage.setItem("ACCESS_TOKEN", newToken);
		} else {
			localStorage.removeItem("ACCESS_TOKEN");
		}
	};

	const login = async (credentials) => {
		const response = await axiosClient.post("/login", credentials);
		setUser(response.data.user);
		setAuthToken(response.data.access_token);
		return response;
	};

	const register = async (userData) => {
		const response = await axiosClient.post("/register", userData);
		// Otomatis login setelah register berhasil
		return login({ email: userData.email, password: userData.password });
	};

	const logout = () => {
		// Di sini Anda bisa memanggil API logout jika perlu
		setUser(null);
		setAuthToken(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, token, login, register, logout, setAuthToken, setUser }}
		>
			{children}
		</AuthContext.Provider>
	);
};

// Custom Hook untuk menggunakan context
export const useAuth = () => {
	return useContext(AuthContext);
};
