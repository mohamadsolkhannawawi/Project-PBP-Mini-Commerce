import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from './SearchBar';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50 font-montserrat">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Brand/Logo */}
                    <Link
                        to="/"
                        className="text-2xl font-bold font-montserrat"
                        style={{ color: '#1B263B' }}
                    >
                        TokoKita
                    </Link>

                    {/* Search Bar di Tengah */}
                    <div className="flex-1 px-8">
                        <SearchBar />
                    </div>

                    {/* Ikon dan Opsi Pengguna */}
                    <div className="flex items-center space-x-6">
                        {' '}
                        {/* Ikon Keranjang (hanya untuk user biasa) */}
                        {user?.role !== 'admin' && (
                            <button
                                onClick={() => navigate('/keranjang')}
                                className="relative text-gray-600 hover:text-[#1B263B] transition-colors"
                            >
                                <ShoppingCart size={24} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        )}
                        {user ? (
                            // Tampilan setelah login
                            <div className="hidden md:flex items-center space-x-4 text-base">
                                {' '}
                                {user.role === 'admin' && (
                                    <NavLink
                                        to="/admin"
                                        className="flex items-center text-gray-600 hover:text-[#1B263B] font-semibold transition-colors"
                                    >
                                        <LayoutDashboard
                                            size={20}
                                            className="mr-2"
                                        />
                                        Admin
                                    </NavLink>
                                )}
                                {/* Pemisah yang lebih modern */}
                                <span className="text-gray-300 h-6 w-px bg-gray-300"></span>
                                <div className="text-gray-700">
                                    Halo,{' '}
                                    <span className="font-semibold">
                                        {user.name}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-red-500 hover:bg-red-50 rounded-md px-3 py-2 transition-colors"
                                >
                                    <LogOut size={20} className="mr-2" />
                                    <span className="font-semibold">
                                        Logout
                                    </span>
                                </button>
                            </div>
                        ) : (
                            // Tampilan sebelum login
                            <div className="hidden md:flex items-center space-x-2">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-4 py-2 text-[#1B263B] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="px-4 py-2 text-white font-semibold rounded-lg transition-opacity hover:opacity-90"
                                    style={{ backgroundColor: '#1B263B' }}
                                >
                                    Register
                                </button>
                            </div>
                        )}
                        {/* Tombol Menu Mobile */}
                        <div className="md:hidden">
                            <button onClick={() => setIsOpen(!isOpen)}>
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
