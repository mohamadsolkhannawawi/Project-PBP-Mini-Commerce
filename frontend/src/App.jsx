import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';
import ManageProductsPage from './pages/admin/ManageProductsPage.jsx';
import ManageOrdersPage from './pages/admin/ManageOrdersPage.jsx';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <Routes>
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<HomePage />} />
                            <Route
                                path="product/:productId"
                                element={<ProductDetailPage />}
                            />
                            <Route path="login" element={<LoginPage />} />
                            <Route path="register" element={<RegisterPage />} />
                            <Route path="keranjang" element={<CartPage />} />
                            <Route path="checkout" element={<CheckoutPage />} />
                            <Route
                                path="search"
                                element={<SearchResultsPage />}
                            />
                        </Route>

                        <Route path="/admin" element={<AdminLayout />}>
                            <Route
                                index
                                element={<Navigate to="products" replace />}
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
                    </Routes>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
