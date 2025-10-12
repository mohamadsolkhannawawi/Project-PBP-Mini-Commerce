import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Eye, EyeOff } from 'lucide-react';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const { showSuccess, showError, showLoading, updateToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        
        const toastId = showLoading('Sedang masuk ke akun Anda...');

        try {
            const response = await login({ email, password });
            
            updateToast(toastId, 'Login berhasil! Selamat datang!', 'success');
            
            if (response.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
            
            if (err.response && err.response.status === 401) {
                errorMessage = 'Email atau password salah.';
            } else if (err.response && err.response.data.errors) {
                const messages = Object.values(err.response.data.errors).flat();
                errorMessage = messages.join(' ');
            }
            
            setError(errorMessage);
            updateToast(toastId, errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#1B263B] font-montserrat flex items-center justify-center">
            <div className="bg-[#EAEAEA] rounded-3xl flex flex-col md:flex-row w-full max-w-4xl shadow-xl p-4 md:p-0">

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
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#415A77] focus:border-[#415A77] text-[#1B263B] placeholder-gray-400 transition-all duration-200 hover:border-[#415A77] hover:shadow-sm"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
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
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#415A77] focus:border-[#415A77] text-[#1B263B] placeholder-gray-400 transition-all duration-200 hover:border-[#415A77] hover:shadow-sm"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#415A77] transition-colors duration-200 hover:scale-110 active:scale-95"
                                        disabled={isLoading}
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
                                <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200 animate-pulse">
                                    {error}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 transform ${
                                    isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#1B263B] hover:bg-[#415A77] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#415A77]'
                                }`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Sedang masuk...
                                    </div>
                                ) : (
                                    'LOGIN'
                                )}
                            </button>
                        </form>
                        <p className="mt-6 text-center text-sm text-gray-500">
                            Belum punya akun?{' '}
                            <Link
                                to="/register"
                                className="font-medium transition-colors duration-200 hover:underline hover:text-[#415A77]"
                                style={{ color: '#1B263B' }}
                            >
                                Daftar sekarang
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="hidden md:flex flex-1 flex-col items-center justify-center p-4">
                    <div className="text-center">
                        <h1 className="font-extrabold text-[#1B263B] drop-shadow-lg leading-tight">
                            <span className="block text-7xl">Toko</span>
                            <span className="block text-5xl -mt-2">Kita</span>
                        </h1>
                        <p className="mt-3 text-2xl font-semibold text-[#415A77] drop-shadow">
                            Easy to shop!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;