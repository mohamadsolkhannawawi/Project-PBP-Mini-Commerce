import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut } from 'lucide-react';

export default function ProfileMenu() {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        function onDoc(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (e) {
            // ignore
        }
        navigate('/login');
    };

    return (
        <div className="relative" ref={ref}>
            <button
                className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100"
                onClick={() => setOpen((s) => !s)}
                aria-haspopup="true"
                aria-expanded={open}
                title={user?.name || 'Admin'}
            >
                <User className="w-7 h-7 text-[#1B263B]" />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-3 border-b">
                        <div className="font-semibold text-sm">
                            {user?.name || 'Admin'}
                        </div>
                        <div className="text-xs text-gray-500">
                            {user?.role || 'Admin'}
                        </div>
                    </div>
                    <div className="py-1">
                        <button
                            className="w-full flex items-center justify-center px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5 text-red-600 mr-2" />
                            <span className="text-red-600 font-medium">
                                Logout
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
