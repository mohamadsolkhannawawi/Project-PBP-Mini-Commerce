import React, { useState, useMemo } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';

function CartPage() {
    const { cartItems, loading, updateCartItem, removeFromCart } = useCart();
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();

    const handleSelectItem = (itemId) => {
        setSelectedItems((prevSelected) => {
            if (prevSelected.includes(itemId)) {
                return prevSelected.filter((id) => id !== itemId);
            } else {
                return [...prevSelected, itemId];
            }
        });
    };

    const itemsToCheckout = useMemo(
        () => cartItems.filter((item) => selectedItems.includes(item.id)),
        [cartItems, selectedItems]
    );

    const subtotal = useMemo(
        () =>
            itemsToCheckout.reduce((total, item) => {
                const price = parseFloat(item.product.price);
                return total + price * item.quantity;
            }, 0),
        [itemsToCheckout]
    );

    const handleCheckout = () => {
        if (itemsToCheckout.length > 0) {
            navigate('/checkout', { state: { items: itemsToCheckout } });
        } else {
            alert('Pilih setidaknya satu produk untuk checkout.');
        }
    };

    if (loading) {
        return <div className="text-center py-20">Memuat keranjang...</div>;
    }

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold mb-4">
                    Keranjang Belanja Anda Kosong
                </h1>
                <p className="text-gray-600 mb-8">
                    Sepertinya Anda belum menambahkan apa pun.
                </p>
                <Link
                    to="/"
                    className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700"
                >
                    Mulai Belanja
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Keranjang Belanja</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
                    {cartItems.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            updateCartItem={updateCartItem}
                            removeFromCart={removeFromCart}
                            onSelectItem={handleSelectItem}
                            isSelected={selectedItems.includes(item.id)}
                        />
                    ))}
                </div>

                <div className="bg-gray-100 p-6 rounded-lg h-fit shadow">
                    <h2 className="text-xl font-bold mb-4">
                        Ringkasan Pesanan
                    </h2>
                    <div className="flex justify-between mb-4 border-b pb-4">
                        <span>
                            Subtotal ({itemsToCheckout.length} produk)
                        </span>
                        <span>
                            Rp {new Intl.NumberFormat('id-ID').format(subtotal)}
                        </span>
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>
                            Rp {new Intl.NumberFormat('id-ID').format(subtotal)}
                        </span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={itemsToCheckout.length === 0}
                        className="block text-center w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        Lanjut ke Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
