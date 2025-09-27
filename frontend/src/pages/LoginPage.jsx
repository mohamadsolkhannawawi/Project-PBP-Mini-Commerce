import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await login({ email, password });
            if (response.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Email atau password salah.');
            } else if (err.response && err.response.data.errors) {
                const messages = Object.values(err.response.data.errors).flat();
                setError(messages.join(' '));
            } else {
                setError('Terjadi kesalahan. Silakan coba lagi.');
            }
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#1B263B] font-montserrat flex items-center justify-center">
            <div className="bg-[#EAEAEA] rounded-3xl flex flex-col md:flex-row w-full max-w-4xl shadow-xl p-4 md:p-0">
                {/* Form Section */}
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white bg-opacity-60 rounded-2xl shadow-lg p-6">
                        <h2
                            className="text-3xl font-bold text-center mb-6"
                            style={{ color: '#1B263B' }}
                        >
                            Login
                        </h2>
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium mb-1"
                                    style={{ color: '#1B263B' }}
                                >
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
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium mb-1"
                                    style={{ color: '#1B263B' }}
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B263B] focus:border-[#1B263B] text-[#1B263B] placeholder-gray-400"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
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
                                SIGN IN
                            </button>
                        </form>
                        <p className="mt-6 text-center text-sm text-gray-500">
                            Don't have an account yet?{' '}
                            <Link
                                to="/register"
                                className="font-medium"
                                style={{ color: '#1B263B' }}
                            >
                                Register for free
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Branding Section */}
                <div className="hidden md:flex flex-1 flex-col items-center justify-center p-4">
                    <div>
                        <h1 className="text-6xl font-extrabold text-[#1B263B] drop-shadow-lg text-center leading-tight">
                            Toko
                            <br />
                            Kita
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

export default LoginPage;
