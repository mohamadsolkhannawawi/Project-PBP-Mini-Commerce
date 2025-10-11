import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useCallback,
} from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        if (token) {
            try {
                const response = await axiosClient.get('/user');
                setUser(response.data);
            } catch (error) {
                console.error('Token tidak valid, menghapus token:', error);
                localStorage.removeItem('ACCESS_TOKEN');
                setToken(null);
                setUser(null);
            }
        }
        setLoading(false);
    }, [token]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const setAuthToken = (newToken) => {
        setToken(newToken);
        if (newToken) {
            localStorage.setItem('ACCESS_TOKEN', newToken);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    };

    const login = async (credentials) => {
        const response = await axiosClient.post('/login', credentials);
        setUser(response.data.user);
        setAuthToken(response.data.access_token);
        return response;
    };

    const register = async (userData) => {
        await axiosClient.post('/register', userData);
        return login({ email: userData.email, password: userData.password });
    };

    const logout = async () => {
        try {
            await axiosClient.post('/logout');
        } catch (error) {
            console.error('Gagal logout dari server:', error);
        } finally {
            setUser(null);
            setAuthToken(null);
        }
    };

    const value = { user, token, loading, login, register, logout };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Memverifikasi sesi...
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}