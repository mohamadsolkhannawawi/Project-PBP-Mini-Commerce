// frontend/src/components/ProfileMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { User, LogOut } from 'lucide-react';

// Dropdown menu for user profile and logout
export default function ProfileMenu() {
    const [open, setOpen] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const ref = useRef(null);
    const { user, logout } = useAuth();
    const { showLoading, updateToast, showError } = useToast();
    const navigate = useNavigate();

    // Close menu when clicking outside
    useEffect(() => {
        function onDoc(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    // Handle user logout
    const handleLogout = async () => {
        if (logoutLoading) return;

        setLogoutLoading(true);
        const toastId = showLoading('Logging out...');

        try {
            await logout();
            updateToast(toastId, 'Berhasil logout!', 'success');
            setOpen(false);
            navigate('/login');
        } catch (e) {
            updateToast(toastId, 'Gagal logout. Silakan coba lagi.', 'error');
        } finally {
            setLogoutLoading(false);
        }
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
                            className={`w-full flex items-center justify-center px-4 py-2 text-sm transition-colors ${
                                logoutLoading
                                    ? 'bg-gray-100 cursor-wait'
                                    : 'hover:bg-gray-100'
                            }`}
                            onClick={handleLogout}
                            disabled={logoutLoading}
                            title={logoutLoading ? 'Logging out...' : 'Logout'}
                        >
                            {logoutLoading ? (
                                <>
                                    <div className="w-5 h-5 mr-2 border-2 border-[#415A77] border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-gray-600 font-medium">
                                        Logging out...
                                    </span>
                                </>
                            ) : (
                                <>
                                    <LogOut className="w-5 h-5 text-red-600 mr-2" />
                                    <span className="text-red-600 font-medium">
                                        Logout
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
