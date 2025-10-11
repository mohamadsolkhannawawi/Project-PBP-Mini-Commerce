import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Eye, EyeOff } from 'lucide-react';

function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { showError, showLoading, updateToast } = useToast();

    const validate = () => {
        const newErrors = {};

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = 'Format email tidak valid.';
        }

        const passwordRules = [
            { test: (p) => p.length >= 8, message: 'minimal 8 karakter' },
            { test: (p) => /[a-z]/.test(p), message: 'huruf kecil' },
            { test: (p) => /[A-Z]/.test(p), message: 'huruf besar' },
            { test: (p) => /\d/.test(p), message: 'angka' },
            { test: (p) => /[^a-zA-Z0-9]/.test(p), message: 'simbol' },
        ];

        const failedRules = passwordRules
            .filter((rule) => !rule.test(password))
            .map((rule) => rule.message);

        if (failedRules.length > 0) {
            newErrors.password = `Password harus mengandung: ${failedRules.join(
                ', '
            )}.`;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword =
                'Password dan konfirmasi password tidak cocok!';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            const firstError = Object.values(validationErrors)[0];
            showError(firstError);
            return;
        }

        setErrors({});
        setIsLoading(true);
        const toastId = showLoading('Membuat akun baru...');

        try {
            await register({
                name,
                email,
                password,
                password_confirmation: confirmPassword,
            });

            updateToast(
                toastId,
                'Akun berhasil dibuat! Selamat bergabung!',
                'success'
            );
            navigate('/login');
        } catch (err) {
            let generalError = 'Gagal mendaftar. Silakan coba lagi.';
            const newErrors = {};

            const resp =
                err.response && err.response.data ? err.response.data : null;

            // Support both shapes:
            // 1) { errors: { field: [msg] } }
            // 2) { field: [msg] }
            let apiErrors = null;
            if (resp) {
                if (resp.errors && typeof resp.errors === 'object') {
                    apiErrors = resp.errors;
                } else if (typeof resp === 'object') {
                    // If it's a plain object that looks like validation errors (has keys like email/password)
                    const possibleKeys = Object.keys(resp);
                    const hasValidationLike = possibleKeys.some((k) =>
                        [
                            'email',
                            'password',
                            'name',
                            'confirmPassword',
                            'password_confirmation',
                        ].includes(k)
                    );
                    if (hasValidationLike) {
                        apiErrors = resp;
                    }
                }
            }

            if (apiErrors) {
                // email
                if (apiErrors.email) {
                    const msg = Array.isArray(apiErrors.email)
                        ? apiErrors.email[0]
                        : apiErrors.email;
                    generalError = msg;
                    newErrors.email = msg;
                }

                // password
                if (apiErrors.password) {
                    const msg = Array.isArray(apiErrors.password)
                        ? apiErrors.password[0]
                        : apiErrors.password;
                    newErrors.password = msg;
                    if (!newErrors.email) {
                        generalError =
                            'Periksa kembali data yang Anda masukkan.';
                    }
                }

                // other field errors -> fallback message
                if (!newErrors.email && !newErrors.password) {
                    generalError = 'Periksa kembali data yang Anda masukkan.';
                }
            } else if (resp && resp.message) {
                // Use explicit message if backend provided one
                generalError = resp.message;
            }

            setErrors(newErrors);
            updateToast(toastId, generalError, 'error');
        } finally {
            setIsLoading(false);
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
                            Register
                        </h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium mb-1"
                                    style={{ color: '#1B263B' }}
                                >
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#415A77] focus:border-[#415A77] text-[#1B263B] placeholder-gray-400 transition-all duration-200 hover:border-[#415A77] hover:shadow-sm"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
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
                                    className={`w-full px-4 py-2 rounded-lg border ${
                                        errors.email
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                    } focus:ring-2 focus:ring-[#415A77] focus:border-[#415A77] text-[#1B263B] placeholder-gray-400 transition-all duration-200 hover:border-[#415A77] hover:shadow-sm`}
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.email}
                                    </p>
                                )}
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
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            errors.password
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } focus:ring-2 focus:ring-[#415A77] focus:border-[#415A77] text-[#1B263B] placeholder-gray-400 transition-all duration-200 hover:border-[#415A77] hover:shadow-sm`}
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
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
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.password}
                                    </p>
                                )}
                                <div className="text-xs text-gray-500 mt-1">
                                    Password harus mengandung minimal 8
                                    karakter, termasuk huruf besar, huruf kecil,
                                    angka, dan simbol.
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="block text-sm font-medium mb-1"
                                    style={{ color: '#1B263B' }}
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        required
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            errors.confirmPassword
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } focus:ring-2 focus:ring-[#415A77] focus:border-[#415A77] text-[#1B263B] placeholder-gray-400 transition-all duration-200 hover:border-[#415A77] hover:shadow-sm`}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#415A77] transition-colors duration-200 hover:scale-110 active:scale-95"
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>
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
                                        Membuat akun...
                                    </div>
                                ) : (
                                    'CREATE ACCOUNT'
                                )}
                            </button>
                        </form>
                        <p className="mt-6 text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-medium transition-colors duration-200 hover:underline hover:text-[#415A77]"
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

export default RegisterPage;
