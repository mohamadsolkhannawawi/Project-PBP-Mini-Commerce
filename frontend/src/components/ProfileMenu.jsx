import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
                className="flex items-center space-x-3 p-1 rounded-full hover:shadow"
                onClick={() => setOpen((s) => !s)}
                aria-haspopup="true"
                aria-expanded={open}
            >
                <img
                    src={user?.avatar || '/no-image.webp'}
                    alt={user?.name || 'User'}
                    className="w-10 h-10 rounded-full object-cover"
                />
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
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
