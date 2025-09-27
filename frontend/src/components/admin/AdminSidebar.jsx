import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Package, ShoppingBag, LogOut } from 'lucide-react';

function AdminSidebar({ user, handleLogout }) {
    const baseLinkClass =
        'flex items-center p-2 text-base font-normal rounded-lg transition-colors duration-150';
    const activeLinkClass = `${baseLinkClass} bg-[#F07167] text-white`;
    const normalLinkClass = `${baseLinkClass} text-gray-100 hover:bg-[#4D809E]`;

    return (
        <aside className="w-64 flex-shrink-0" aria-label="Sidebar">
            <div className="relative overflow-y-auto py-4 px-3 h-full bg-[#001F3F] text-white">
                <Link to="/" className="flex items-center pl-2.5 mb-5">
                    <span className="self-center text-xl font-semibold whitespace-nowrap">
                        Admin Panel
                    </span>
                </Link>
                <div className="p-2 mb-4 border-t border-b border-gray-700">
                    <p className="text-sm font-semibold text-gray-400">
                        Selamat Datang,
                    </p>
                    <p className="font-bold">{user.name}</p>
                </div>
                <ul className="space-y-2">
                    <li>
                        <NavLink
                            to="/admin/products"
                            className={({ isActive }) =>
                                isActive ? activeLinkClass : normalLinkClass
                            }
                        >
                            <Package className="w-6 h-6" />
                            <span className="ml-3">Manajemen Produk</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/orders"
                            className={({ isActive }) =>
                                isActive ? activeLinkClass : normalLinkClass
                            }
                        >
                            <ShoppingBag className="w-6 h-6" />
                            <span className="ml-3">Manajemen Pesanan</span>
                        </NavLink>
                    </li>
                </ul>
                <div className="absolute bottom-0 left-0 p-4 w-64">
                    <button
                        onClick={handleLogout}
                        className={`w-full ${normalLinkClass}`}
                    >
                        <LogOut className="w-6 h-6" />
                        <span className="ml-3">Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default AdminSidebar;
