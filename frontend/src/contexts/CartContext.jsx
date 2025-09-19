import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useCallback,
} from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [cartId, setCartId] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const { token } = useAuth();

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
            await axiosClient.post('/cart', {
                product_id: product.id,
                quantity,
            });
            await fetchCart();
        } catch (error) {
            console.error('Gagal menambahkan ke keranjang:', error);
            alert('Gagal menambahkan produk ke keranjang.');
        }
    };

    const updateCartItem = async (cartItemId, quantity) => {
        try {
            await axiosClient.put(`/cart-items/${cartItemId}`, { quantity });
            await fetchCart();
        } catch (error) {
            console.error('Gagal mengubah jumlah item:', error);
            alert('Gagal mengubah jumlah item.');
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await axiosClient.delete(`/cart-items/${cartItemId}`);
            await fetchCart();
        } catch (error) {
            console.error('Gagal menghapus item:', error);
            alert('Gagal menghapus item.');
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