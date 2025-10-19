// frontend/src/components/Navbar.jsx
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
import { useToast } from '../contexts/ToastContext';
import SearchBar from './SearchBar';
import axiosClient from '../api/axiosClient';

// Main navigation bar for site
function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCategoryOpen, setCategoryOpen] = useState(false);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const { showLoading, updateToast } = useToast();
    const navigate = useNavigate();
    const categoryMenuRef = useRef(null);
    const profileMenuRef = useRef(null);

    // Fetch categories for dropdown
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

    // Close dropdowns when clicking outside
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

    // Responsive: close menu on desktop resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle user logout
    const handleLogout = async () => {
        if (logoutLoading) return;

        setLogoutLoading(true);
        const toastId = showLoading('Logging out...');

        try {
            await logout();
            updateToast(toastId, 'Berhasil logout!', 'success');
            setProfileOpen(false);
            navigate('/login');
        } catch (e) {
            updateToast(toastId, 'Gagal logout. Silakan coba lagi.', 'error');
        } finally {
            setLogoutLoading(false);
        }
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50 font-montserrat">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4 gap-x-4">
                    <Link
                        to="/"
                        className="text-2xl font-bold font-montserrat"
                        style={{ color: '#1B263B' }}
                    >
                        TokoKita
                    </Link>

                    <div className="flex-1 flex justify-center items-center gap-2 px-2">
                        <div className="relative" ref={categoryMenuRef}>
                            <button
                                onClick={() => setCategoryOpen(!isCategoryOpen)}
                                className={[
                                    'w-full flex items-center justify-between gap-2 h-11 px-4',
                                    'rounded-full border border-gray-200 bg-white text-[#1B263B]',
                                    'hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#415A77]',
                                    isCategoryOpen ? 'shadow-sm' : '',
                                ].join(' ')}
                                aria-expanded={isCategoryOpen}
                                aria-haspopup="menu"
                            >
                                <span className="font-semibold">
                                    Categories
                                </span>
                                <ChevronDown
                                    size={18}
                                    className={[
                                        'transition-transform duration-200',
                                        isCategoryOpen
                                            ? 'rotate-180'
                                            : 'rotate-0',
                                    ].join(' ')}
                                />
                            </button>
                            {isCategoryOpen && (
                                <div
                                    role="menu"
                                    className="absolute left-0 mt-2 w-full rounded-2xl bg-white border border-gray-200 shadow-2xl p-4 z-10"
                                >
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
                                                disabled={logoutLoading}
                                                className={`flex items-center w-full px-4 py-2 rounded-md transition-colors ${
                                                    logoutLoading
                                                        ? 'text-gray-500 bg-gray-50 cursor-wait'
                                                        : 'text-red-500 hover:bg-red-50'
                                                }`}
                                            >
                                                {logoutLoading ? (
                                                    <>
                                                        <div className="w-4 h-4 mr-2 border-2 border-[#415A77] border-t-transparent rounded-full animate-spin"></div>
                                                        <span>
                                                            Logging out...
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <LogOut
                                                            size={18}
                                                            className="mr-2"
                                                        />
                                                        Logout
                                                    </>
                                                )}
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

                        <div className="md:hidden relative">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-[#1B263B] focus:outline-none"
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>

                            {isOpen && (
                                <div className="absolute right-0 mt-3 w-56 rounded-xl border border-gray-200 bg-white shadow-xl z-50 py-2transition-all duration-200 ease-out animate-fadeIn">
                                    {user ? (
                                        <>
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <span className="block text-sm font-semibold text-[#1B263B]">
                                                    {user.name}
                                                </span>
                                                <span className="block text-xs text-gray-500">
                                                    {user.email}
                                                </span>
                                            </div>

                                            {user.role === 'admin' && (
                                                <NavLink
                                                    to="/admin"
                                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                                    onClick={() =>
                                                        setIsOpen(false)
                                                    }
                                                >
                                                    <LayoutDashboard
                                                        size={18}
                                                    />
                                                    <span>Admin Panel</span>
                                                </NavLink>
                                            )}

                                            {user.role !== 'admin' && (
                                                <NavLink
                                                    to="/order-history"
                                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                                    onClick={() =>
                                                        setIsOpen(false)
                                                    }
                                                >
                                                    <ClipboardClock size={18} />
                                                    <span>Riwayat Pesanan</span>
                                                </NavLink>
                                            )}

                                            <button
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    handleLogout();
                                                }}
                                                className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-red-50"
                                            >
                                                <LogOut size={18} />
                                                <span>Logout</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    navigate('/login');
                                                }}
                                                className="block w-full text-left px-4 py-2 text-[#1B263B] hover:bg-gray-50"
                                            >
                                                Login
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    navigate('/register');
                                                }}
                                                className="block w-full text-left px-4 py-2 text-white bg-[#1B263B] hover:opacity-90"
                                            >
                                                Register
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
