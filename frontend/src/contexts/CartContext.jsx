import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useCallback,
} from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [cartId, setCartId] = useState(null);
    const [loading, setLoading] = useState(true);

    const { token } = useAuth();
    const { showSuccess, showError } = useToast();

    const fetchCart = useCallback(async () => {
        if (!token) {
            setCartItems([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axiosClient.get('/cart');
            setCartItems(response.data.items || []);
            setCartId(response.data.id);
        } catch (error) {
            console.error('Gagal memuat keranjang:', error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (product, quantity) => {
        try {
            const response = await axiosClient.post('/cart', {
                product_id: product.id,
                quantity,
            });
            await fetchCart();
            
            showSuccess(`${product.name} berhasil ditambahkan ke keranjang!`);
            
            return response.data;
        } catch (error) {
            console.error('Gagal menambahkan ke keranjang:', error);

            let errorMessage = 'Gagal menambahkan produk ke keranjang.';
            
            // Handle specific error cases
            if (error.response?.status === 401 || error.response?.data?.message === 'Unauthenticated') {
                errorMessage = 'Silakan login atau register terlebih dahulu untuk menambahkan produk ke keranjang.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            showError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const updateCartItem = async (cartItemId, quantity) => {
        try {
            await axiosClient.put(`/cart-items/${cartItemId}`, { quantity });
            await fetchCart();
            
            showSuccess('Jumlah item berhasil diubah!');
        } catch (error) {
            console.error('Gagal mengubah jumlah item:', error);
            
            let errorMessage = 'Gagal mengubah jumlah item.';
            
            if (error.response?.status === 401 || error.response?.data?.message === 'Unauthenticated') {
                errorMessage = 'Silakan login terlebih dahulu untuk mengubah jumlah item.';
            }
            
            showError(errorMessage);
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await axiosClient.delete(`/cart-items/${cartItemId}`);
            await fetchCart();
            
            showSuccess('Item berhasil dihapus dari keranjang!');
        } catch (error) {
            console.error('Gagal menghapus item:', error);
            
            let errorMessage = 'Gagal menghapus item.';
            
            if (error.response?.status === 401 || error.response?.data?.message === 'Unauthenticated') {
                errorMessage = 'Silakan login terlebih dahulu untuk menghapus item.';
            }
            
            showError(errorMessage);
        }
    };

    const cartCount = cartItems.reduce(
        (count, item) => count + item.quantity,
        0
    );

    const subtotal = cartItems.reduce((total, item) => {
        const price = parseFloat(item.product.price);
        return total + price * item.quantity;
    }, 0);

    const value = {
        cartItems,
        cartCount,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        fetchCart,
        subtotal,
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}