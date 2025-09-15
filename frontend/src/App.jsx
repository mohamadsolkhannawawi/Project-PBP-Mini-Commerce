import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import ManageProductsPage from "./pages/admin/ManageProductsPage.jsx";
import ManageOrdersPage from "./pages/admin/ManageOrdersPage.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import { Navigate } from "react-router-dom";


function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<CartProvider>
					<Routes>
						{/* Rute Publik */}
						<Route path="/" element={<MainLayout />}>
							<Route index element={<HomePage />} />
							{/* ... rute publik lainnya ... */}
						</Route>

						{/* Rute Admin dengan Layout Khusus */}
						<Route path="/admin" element={<AdminLayout />}>
							<Route index element={<Navigate to="products" />} />{" "}
							{/* Redirect /admin ke /admin/products */}
							<Route path="products" element={<ManageProductsPage />} />
							<Route path="orders" element={<ManageOrdersPage />} />
						</Route>
					</Routes>
				</CartProvider>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
