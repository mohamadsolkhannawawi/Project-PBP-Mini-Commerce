import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';
import ManageProductsPage from './pages/admin/ManageProductsPage.jsx';
import ManageOrdersPage from './pages/admin/ManageOrdersPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ToastProvider>
                    <CartProvider>
                        <ToastContainer
                            position="bottom-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="colored"
                        />

                        <Routes>
                            <Route path="/" element={<MainLayout />}>
                                <Route index element={<HomePage />} />
                                <Route
                                    path="product/:productId"
                                    element={<ProductDetailPage />}
                                />
                                <Route path="keranjang" element={<CartPage />} />
                                <Route path="checkout" element={<CheckoutPage />} />
                                <Route
                                    path="search"
                                    element={<SearchResultsPage />}
                                />
                                <Route
                                    path="category/:categoryId"
                                    element={<CategoryPage />}
                                />
                            </Route>

                            <Route element={<AuthLayout />}>
                                <Route path="login" element={<LoginPage />} />
                                <Route path="register" element={<RegisterPage />} />
                            </Route>

                            <Route path="/admin" element={<AdminLayout />}>
                                <Route
                                    index
                                    element={<Navigate to="dashboard" replace />}
                                />
                                <Route
                                    path="dashboard"
                                    element={<AdminDashboardPage />}
                                />
                                <Route
                                    path="products"
                                    element={<ManageProductsPage />}
                                />
                                <Route
                                    path="orders"
                                    element={<ManageOrdersPage />}
                                />
                            </Route>

                            <Route
                                path="/order-history"
                                element={<OrderHistoryPage />}
                            />
                        </Routes>
                    </CartProvider>
                </ToastProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;