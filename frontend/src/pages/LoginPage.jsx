import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		try {
			await login({ email, password });
			navigate("/"); // Arahkan ke halaman utama setelah login berhasil
		} catch (err) {
			if (err.response && err.response.status === 401) {
				setError("Email atau password salah.");
			} else {
				setError("Terjadi kesalahan. Silakan coba lagi.");
			}
		}
	};

	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Masuk ke Akun Anda
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Atau{" "}
						<Link
							to="/register"
							className="font-medium text-blue-600 hover:text-blue-500"
						>
							daftar untuk akun baru
						</Link>
					</p>
				</div>
				<form
					className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md"
					onSubmit={handleSubmit}
				>
					{error && (
						<div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
							{error}
						</div>
					)}
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="email-address" className="sr-only">
								Alamat Email
							</label>
							<input
								id="email-address"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Alamat Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							Masuk
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default LoginPage;
