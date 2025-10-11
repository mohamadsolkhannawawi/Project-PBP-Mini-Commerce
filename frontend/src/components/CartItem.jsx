import React, { useState, useMemo } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

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

    const handleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map(item => item.id));
        }
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await updateCartItem(itemId, newQuantity);
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (window.confirm('Hapus item ini dari keranjang?')) {
            try {
                await removeFromCart(itemId);
                setSelectedItems(prev => prev.filter(id => id !== itemId));
            } catch (error) {
                console.error('Error removing item:', error);
            }
        }
    };

    const itemsToCheckout = useMemo(
        () => cartItems.filter((item) => selectedItems.includes(item.id)),
        [cartItems, selectedItems]
    );

    const handleCheckout = () => {
        if (itemsToCheckout.length > 0) {
            navigate('/checkout', { state: { items: itemsToCheckout } });
        } else {
            alert('Pilih setidaknya satu produk untuk checkout.');
        }
    };

    if (loading) {
        return <div className="text-center py-20 font-montserrat">Memuat keranjang...</div>;
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 font-montserrat">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
                        <div className="text-center">
                            <h1 className="text-6xl font-bold mb-8 text-black leading-tight">
                                Keranjang Anda Masih Kosong!
                            </h1>
                            <p className="text-black mb-12 text-lg max-w-2xl mx-auto leading-relaxed">
                                Jelajahi lebih banyak produk dan dapatkan Penawaran Terbaik hanya di<br />
                                TokoKita!
                            </p>
                            <Link
                                to="/"
                                className="inline-block px-10 py-4 text-white font-medium rounded-lg transition-colors text-base"
                                style={{ backgroundColor: '#1B263B' }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#0F1A2A'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#1B263B'}
                            >
                                Lanjutkan Belanja?
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 font-montserrat pb-24">
            <div className="container mx-auto px-4 py-6">
                {/* Header Table */}
                <div className="mb-4 rounded-lg overflow-hidden shadow-lg">
                    <div 
                        className="flex items-center py-4 px-6 text-white font-medium"
                        style={{ backgroundColor: '#1B263B' }}
                    >
                        <div className="flex items-center justify-start w-16">
                            <input
                                type="checkbox"
                                checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                                onChange={handleSelectAll}
                                className="w-5 h-5 rounded border-2 border-white bg-transparent focus:ring-0"
                                style={{ accentColor: '#4A90E2' }}
                            />
                        </div>
                        <div className="flex-1 text-left flex items-center">Produk</div>
                        <div className="w-40 text-center flex items-center justify-center">Jumlah</div>
                        <div className="w-32 text-center flex items-center justify-center">Total Harga</div>
                        <div className="w-20 text-center flex items-center justify-center">Aksi</div>
                    </div>
                </div>

                {/* Cart Items */}
                <div className="space-y-3 mb-8">
                    {cartItems.map((item) => (
                        <div key={item.id} className="bg-gray-200 rounded-lg shadow-md">
                            <div className="flex items-center p-4">
                                {/* Checkbox */}
                                <div className="w-16 flex justify-start items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        onChange={() => handleSelectItem(item.id)}
                                        className="w-5 h-5 rounded border-2 border-gray-400"
                                        style={{ accentColor: '#4A90E2' }}
                                    />
                                </div>

                                {/* Product Image & Info */}
                                <div className="flex-1 flex items-center">
                                    <div className="w-16 h-16 bg-white rounded-lg border-2 border-black flex items-center justify-center mr-4 flex-shrink-0">
                                        {item.product.image_url ? (
                                            <img 
                                                src={item.product.image_url} 
                                                alt={item.product.name}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="text-gray-600 text-center">
                                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-black text-base leading-tight mb-1">
                                            {item.product.name}
                                        </h3>
                                        <p className="text-black font-medium text-sm">
                                            Rp{new Intl.NumberFormat('id-ID').format(item.product.price)}
                                        </p>
                                    </div>
                                </div>

                                {/* Quantity Controls */}
                                <div className="w-40 text-center flex flex-col items-center">
                                    <div className="flex items-center justify-center space-x-1 mb-1">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            className="w-8 h-8 rounded-md border border-gray-500 bg-white flex items-center justify-center hover:bg-gray-50 text-gray-700 font-medium"
                                            disabled={item.quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const newQty = parseInt(e.target.value);
                                                if (newQty >= 1) {
                                                    handleQuantityChange(item.id, newQty);
                                                }
                                            }}
                                            className="w-12 h-8 text-center border border-gray-500 rounded-md bg-white text-black font-medium"
                                            min="1"
                                        />
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            className="w-8 h-8 rounded-md border border-gray-500 bg-white flex items-center justify-center hover:bg-gray-50 text-gray-700 font-medium"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        Stok: {item.product.stock}
                                    </p>
                                </div>

                                {/* Total Price */}
                                <div className="w-32 text-center flex items-center justify-center">
                                    <p className="font-medium text-black text-sm">
                                        Rp{new Intl.NumberFormat('id-ID').format(item.product.price * item.quantity)}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="w-20 text-center flex items-center justify-center">
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-gray-300 transition-colors"
                                        title="Hapus item"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fixed Bottom Bar with Checkout Button */}
            <div 
                className="fixed bottom-0 left-0 right-0 py-4 px-6 flex justify-end shadow-lg"
                style={{ backgroundColor: '#1B263B' }}
            >
                <button
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                    className="px-8 py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                        backgroundColor: selectedItems.length > 0 ? '#4A90E2' : '#6B7280'
                    }}
                >
                    Checkout
                </button>
            </div>
        </div>
    );
}

export default CartPage;