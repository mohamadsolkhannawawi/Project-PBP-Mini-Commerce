import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import {
    Menu,
    X,
    ShoppingCart,
    LogOut,
    LayoutDashboard,
    ChevronDown,
    CircleUser,
    ClipboardClock,
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from './SearchBar';
import axiosClient from '../api/axiosClient';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCategoryOpen, setCategoryOpen] = useState(false);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const categoryMenuRef = useRef(null);
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosClient.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                categoryMenuRef.current &&
                !categoryMenuRef.current.contains(event.target)
            ) {
                setCategoryOpen(false);
            }
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50 font-montserrat">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <Link
                        to="/"
                        className="text-2xl font-bold font-montserrat"
                        style={{ color: '#1B263B' }}
                    >
                        TokoKita
                    </Link>

                    <div className="flex-1 flex justify-center items-center px-8">
                        <div className="relative" ref={categoryMenuRef}>
                            <button
                                onClick={() => setCategoryOpen(!isCategoryOpen)}
                                className="flex items-center bg-gray-100 border border-gray-300 rounded-l-md px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none h-full"
                            >
                                <span>Categories</span>
                                <ChevronDown size={20} className="ml-2" />
                            </button>
                            {isCategoryOpen && (
                                <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                    {categories.slice(0, 5).map((category) => (
                                        <Link
                                            key={category.id}
                                            to={`/category/${category.id}`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() =>
                                                setCategoryOpen(false)
                                            }
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                    {categories.length > 5 && (
                                        <>
                                            <div className="border-t border-gray-200 my-1"></div>
                                            <HashLink
                                                to="/#all-categories"
                                                smooth
                                                className="block px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-100"
                                                onClick={() =>
                                                    setCategoryOpen(false)
                                                }
                                            >
                                                More Categories...
                                            </HashLink>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <SearchBar />
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
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
                            <div className="hidden md:flex items-center space-x-4 text-base">
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
                                <span className="text-gray-300 h-6 w-px bg-gray-300"></span>
                                {/* Profile Dropdown - click based */}
                                <div className="relative" ref={profileMenuRef}>
                                    <button
                                        className="flex items-center gap-2 text-gray-700 font-semibold focus:outline-none"
                                        onClick={() =>
                                            setProfileOpen((prev) => !prev)
                                        }
                                    >
                                        <CircleUser size={24} />
                                        <span>{user.name}</span>
                                        <ChevronDown size={18} />
                                    </button>
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                            {/* Only show Riwayat Pesanan for regular user */}
                                            {user.role !== 'admin' && (
                                                <Link
                                                    to="/order-history"
                                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                    onClick={() =>
                                                        setProfileOpen(false)
                                                    }
                                                >
                                                    <ClipboardClock
                                                        size={18}
                                                        className="mr-2"
                                                    />
                                                    Riwayat Pesanan
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setProfileOpen(false);
                                                    handleLogout();
                                                }}
                                                className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-md"
                                            >
                                                <LogOut
                                                    size={18}
                                                    className="mr-2"
                                                />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
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
