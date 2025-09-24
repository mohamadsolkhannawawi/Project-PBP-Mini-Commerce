import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Password tidak cocok!');
            return;
        }
        setError(null);
        try {
            await register({
                name,
                email,
                password,
                password_confirmation: password,
            });
            navigate('/');
        } catch (err) {
            if (err.response && err.response.data.errors) {
                const messages = Object.values(err.response.data.errors).flat();
                setError(messages.join(' '));
            } else {
                setError('Gagal mendaftar. Silakan coba lagi.');
            }
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#1B263B] font-montserrat flex items-center justify-center">
            <div className="bg-[#EAEAEA] rounded-3xl flex flex-col md:flex-row w-full max-w-4xl shadow-xl p-4 md:p-0">
                {/* Form Section */}
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white bg-opacity-60 rounded-2xl shadow-lg p-6">
                        <h2 className="text-3xl font-bold text-center mb-6" style={{ color: '#1B263B' }}>
                            Register
                        </h2>
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: '#1B263B' }}>
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B263B] focus:border-[#1B263B] text-[#1B263B] placeholder-gray-400"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: '#1B263B' }}>
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B263B] focus:border-[#1B263B] text-[#1B263B] placeholder-gray-400"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: '#1B263B' }}>
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    // DIUBAH: className ini diganti untuk menambahkan bingkai
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B263B] focus:border-[#1B263B] text-[#1B263B] placeholder-gray-400"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium mb-1" style={{ color: '#1B263B' }}>
                                    Confirm Password
                                </label>
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B263B] focus:border-[#1B263B] text-[#1B263B] placeholder-gray-400"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            {error && (
                                <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                                    {error}
                                </div>
                            )}
                            <button
                                type="submit"
                                className="w-full py-3 rounded-lg font-semibold text-white bg-[#1B263B] hover:bg-[#16213A] transition"
                            >
                                CREATE ACCOUNT
                            </button>
                        </form>
                        <p className="mt-6 text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-medium"
                                style={{ color: '#1B263B' }}
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Branding Section */}
                <div className="hidden md:flex flex-1 flex-col items-center justify-center p-4">
                    <div>
                        <h1 className="text-6xl font-extrabold text-[#1B263B] drop-shadow-lg text-center leading-tight">
                            Toko<br />Kita
                        </h1>
                        <p className="mt-4 text-2xl font-semibold text-[#415A77] text-center drop-shadow">
                            Easy to shop!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;