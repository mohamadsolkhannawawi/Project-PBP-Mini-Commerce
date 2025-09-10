import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ManageProductsPage from "./pages/admin/ManageProductsPage";
import ManageOrdersPage from "./pages/admin/ManageOrdersPage";
import ProductDetailPage from "./pages/ProductDetailPage"; // <-- IMPORT HALAMAN BARU

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<HomePage />} />
					<Route
						path="product/:productId"
						element={<ProductDetailPage />}
					/>{" "}
					{/* <-- TAMBAHKAN RUTE BARU DI SINI */}
					<Route path="login" element={<LoginPage />} />
					<Route path="register" element={<RegisterPage />} />
					<Route path="cart" element={<CartPage />} />
					<Route path="checkout" element={<CheckoutPage />} />
				</Route>

				<Route path="/admin">
					<Route index element={<AdminDashboardPage />} />
					<Route path="products" element={<ManageProductsPage />} />
					<Route path="orders" element={<ManageOrdersPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
