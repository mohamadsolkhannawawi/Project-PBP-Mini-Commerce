import React, { createContext, useState, useContext } from "react";

// 1. Membuat Context
const CartContext = createContext();

// 2. Custom Hook untuk mempermudah penggunaan context
export function useCart() {
	return useContext(CartContext);
}

// 3. Provider Component
export function CartProvider({ children }) {
	const [cartItems, setCartItems] = useState([]);

	const addToCart = (product, quantity) => {
		setCartItems((prevItems) => {
			const existingItem = prevItems.find((item) => item.id === product.id);
			if (existingItem) {
				// Jika item sudah ada, update jumlahnya
				return prevItems.map((item) =>
					item.id === product.id
						? { ...item, quantity: item.quantity + quantity }
						: item
				);
			} else {
				// Jika item baru, tambahkan ke keranjang
				return [...prevItems, { ...product, quantity }];
			}
		});
	};

	const removeFromCart = (productId) => {
		setCartItems((prevItems) =>
			prevItems.filter((item) => item.id !== productId)
		);
	};

	const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

	const value = {
		cartItems,
		addToCart,
		removeFromCart,
		cartCount,
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
