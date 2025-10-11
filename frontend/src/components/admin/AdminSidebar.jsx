import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
    Package,
    ShoppingBag,
    LogOut,
    Gauge,
    Home as House,
} from 'lucide-react';

function AdminSidebar({ user, handleLogout }) {
    const baseLinkClass =
        'flex items-center p-2 text-base font-normal rounded-lg transition-colors duration-150';
    const activeLinkClass = `${baseLinkClass} bg-[#415A77] text-white`;
    const normalLinkClass = `${baseLinkClass} text-gray-100 hover:bg-[#4D809E]`;

    return (
        <aside className="w-64 flex-shrink-0" aria-label="Sidebar">
            <div className="relative overflow-y-auto py-4 px-3 h-full bg-[#1B263B] text-white font-montserrat flex flex-col">
                <Link to="/" className="flex items-center justify-center mb-5">
                    <div className="text-center">
                        <div className="text-6xl font-bold text-white leading-none">
                            Toko
                        </div>
                        <div className="text-5xl font-bold text-white -mt-1 leading-none">
                            Kita
                        </div>
                    </div>
                </Link>

                <div className="border-t border-white/20 mt-2 mb-4" />
                <div className="px-3 mb-2">
                    <div className="text-xs uppercase text-white/60 font-semibold">
                        General
                    </div>
                </div>

                <ul className="space-y-2 flex-1">
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? activeLinkClass : normalLinkClass
                            }
                        >
                            <House className="w-6 h-6" />
                            <span className="ml-3">Homepage</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/dashboard"
                            className={({ isActive }) =>
                                isActive ? activeLinkClass : normalLinkClass
                            }
                        >
                            <Gauge className="w-6 h-6" />
                            <span className="ml-3">Dashboard</span>
                        </NavLink>
                    </li>
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

                <div className="mt-auto">
                    <div className="border-t border-white/20 mb-4" />
                    <div className="px-3 text-center">
                        <div className="text-xs text-white/50">
                            © 2025 Toko Kita
                        </div>
                        <div className="text-xs text-white/40 mt-1">
                            All rights reserved
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default AdminSidebar;