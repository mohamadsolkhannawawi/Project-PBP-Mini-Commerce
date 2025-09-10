import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Layout
import MainLayout from './layouts/MainLayout';

// Import Halaman Pengguna
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

// Import Halaman Admin
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageProductsPage from './pages/admin/ManageProductsPage';
import ManageOrdersPage from './pages/admin/ManageOrdersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute untuk Pengguna Umum dengan Layout Utama */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          {/* Tambahkan rute lain yang memerlukan Navbar/Footer di sini */}
        </Route>

        {/* Rute untuk Halaman Admin (tanpa layout utama) */}
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