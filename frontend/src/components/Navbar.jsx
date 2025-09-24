import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
    Menu,
    X,
    ShoppingCart,
    User,
    LogOut,
    LayoutDashboard,
} from 'lucide-react';
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
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" className="text-2xl font-bold text-gray-800">
                        TokoKita
                    </Link>

                    <div className="flex-1 px-8">
                        <SearchBar />
                    </div>

                    <div className="flex items-center space-x-4">
                        {user?.role !== 'admin' && (
                            <button
                                onClick={() => navigate('/keranjang')}
                                className="relative text-gray-600 hover:text-blue-500"
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
                            <div className="hidden md:flex items-center space-x-4">
                                {user.role === 'admin' && (
                                    <NavLink
                                        to="/admin"
                                        className="flex items-center text-gray-600 hover:text-blue-500"
                                    >
                                        <LayoutDashboard
                                            size={20}
                                            className="mr-1"
                                        />{' '}
                                        Admin
                                    </NavLink>
                                )}
                                <span className="text-gray-700">|</span>
                                <span className="text-gray-700">
                                    Halo, {user.name}!
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-gray-600 hover:text-blue-500"
                                >
                                    <LogOut size={20} className="mr-1" /> Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden md:flex items-center text-gray-600 hover:text-blue-500"
                            >
                                <User size={24} className="mr-1" />
                                Login
                            </Link>
                        )}

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

export default Navbar; // Export Navbar
