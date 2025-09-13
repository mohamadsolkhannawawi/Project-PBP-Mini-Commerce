import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; // <-- IMPORT PROVIDER
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ManageProductsPage from "./pages/admin/ManageProductsPage";
import ManageOrdersPage from "./pages/admin/ManageOrdersPage";

function App() {
	return (
		<CartProvider>
			{" "}
			{/* <-- BUNGKUS DENGAN PROVIDER */}
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<MainLayout />}>
						<Route index element={<HomePage />} />
						<Route path="product/:productId" element={<ProductDetailPage />} />
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
		</CartProvider>
	);
}

export default App;
