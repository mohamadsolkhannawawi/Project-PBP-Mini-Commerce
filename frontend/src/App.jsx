import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Nanti kita akan membuat file-file ini. Untuk sekarang, biarkan saja.
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import CartPage from './pages/CartPage';
// import CheckoutPage from './pages/CheckoutPage';
// import AdminDashboardPage from './pages/admin/AdminDashboardPage';
// import ManageProductsPage from './pages/admin/ManageProductsPage';
// import ManageOrdersPage from './pages/admin/ManageOrdersPage';

function App() {
	// Komponen placeholder sederhana agar tidak error sebelum file aslinya dibuat
	const Placeholder = ({ title }) => (
		<div className="flex justify-center items-center h-screen">
			<h1 className="text-3xl font-bold">Halaman {title}</h1>
		</div>
	);

	return (
		<Router>
			<Routes>
				{/* --- Rute Publik --- */}
				<Route path="/" element={<Placeholder title="Home" />} />
				<Route path="/login" element={<Placeholder title="Login" />} />
				<Route path="/register" element={<Placeholder title="Register" />} />

				{/* --- Rute Pengguna Terotentikasi --- */}
				<Route path="/cart" element={<Placeholder title="Keranjang" />} />
				<Route path="/checkout" element={<Placeholder title="Checkout" />} />

				{/* --- Rute Admin (Nanti akan kita lindungi) --- */}
				<Route
					path="/admin"
					element={<Placeholder title="Dashboard Admin" />}
				/>
				<Route
					path="/admin/products"
					element={<Placeholder title="Manajemen Produk" />}
				/>
				<Route
					path="/admin/orders"
					element={<Placeholder title="Manajemen Pesanan" />}
				/>

				{/* --- Rute untuk Halaman Tidak Ditemukan --- */}
				<Route path="*" element={<Placeholder title="404 Not Found" />} />
			</Routes>
		</Router>
	);
}

export default App;
