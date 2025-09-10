import React, { useState } from "react";
import { Link } from "react-router-dom";

function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			alert("Password tidak cocok!");
			return;
		}
		// TODO: Logika untuk mengirim data pendaftaran ke backend
		console.log("Mencoba mendaftar dengan:", { email, password });
		alert("Fungsionalitas pendaftaran sedang dalam pengembangan.");
	};

	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Buat Akun Baru
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Atau{" "}
						<Link
							to="/login"
							className="font-medium text-blue-600 hover:text-blue-500"
						>
							sudah punya akun? Masuk
						</Link>
					</p>
				</div>
				<form
					className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md"
					onSubmit={handleSubmit}
				>
					<div className="rounded-md shadow-sm space-y-4">
						<div>
							<label htmlFor="email-address">Alamat Email</label>
							<input
								id="email-address"
								name="email"
								type="email"
								required
								className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="contoh@email.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor="password">Password</label>
							<input
								id="password"
								name="password"
								type="password"
								required
								className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="Minimal 6 karakter"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor="confirm-password">Konfirmasi Password</label>
							<input
								id="confirm-password"
								name="confirm-password"
								type="password"
								required
								className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="Ulangi password Anda"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							Daftar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default RegisterPage;
