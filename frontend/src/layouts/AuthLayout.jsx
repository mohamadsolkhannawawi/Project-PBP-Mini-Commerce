// frontend/src/layouts/AuthLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

// Layout for authentication pages (login/register)
function AuthLayout() {
    return (
        <div className="relative min-h-screen">
            <header className="absolute top-0 left-0 w-full p-4 md:p-6 z-10">
                <Link
                    to="/"
                    className="text-2xl font-bold text-white hover:opacity-80 transition-opacity font-montserrat"
                >
                    TokoKita
                </Link>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default AuthLayout;
