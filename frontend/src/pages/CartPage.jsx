import React, { useState, useMemo } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { getProductImageUrl } from '../utils/imageUtils';
import { useToast } from '../contexts/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

function CartPage() {
    const { cartItems, loading, updateCartItem, removeFromCart } = useCart();
    const [selectedItems, setSelectedItems] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null); // TAMBAHAN: untuk edit manual
    const navigate = useNavigate();
    const { showWarning } = useToast();

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
            setSelectedItems(cartItems.map((item) => item.id));
        }
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await updateCartItem(itemId, newQuantity);
            setEditingItemId(null); // TAMBAHAN: tutup edit mode setelah update
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await removeFromCart(itemId);
            setSelectedItems((prev) => prev.filter((id) => id !== itemId));
        } catch (error) {
            console.error('Error removing item:', error);
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
            showWarning('Pilih setidaknya satu produk untuk checkout.');
        }
    };

    if (loading) {
        return <LoadingSpinner text="Memuat keranjang..." size="lg" className="py-12" />;
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 font-montserrat">
                <div className="container mx-auto px-4">
                    <div
                        className="flex items-center justify-center"
                        style={{ minHeight: 'calc(100vh - 200px)' }}
                    >
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-black leading-tight">
                                Keranjang Anda Masih Kosong!
                            </h1>
                            <p className="text-black mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
                                Jelajahi lebih banyak produk dan dapatkan
                                Penawaran Terbaik hanya di
                                <br />
                                TokoKita!
                            </p>
                            <Link
                                to="/"
                                className="inline-block px-10 py-4 text-white font-medium rounded-lg transition-colors text-base"
                                style={{ backgroundColor: '#1B263B' }}
                                onMouseEnter={(e) =>
                                    (e.target.style.backgroundColor = '#0F1A2A')
                                }
                                onMouseLeave={(e) =>
                                    (e.target.style.backgroundColor = '#1B263B')
                                }
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
        <div className="min-h-screen bg-white font-montserrat pb-24">
            <div className="container mx-auto px-4 py-6">

                <div className="mb-2 rounded-lg overflow-hidden shadow-lg">
                    <div
                        className="flex items-center py-4 px-6 text-white font-medium"
                        style={{ backgroundColor: '#1B263B' }}
                    >
                        <div className="flex items-center justify-start w-16">
                            <input
                                type="checkbox"
                                checked={
                                    selectedItems.length === cartItems.length &&
                                    cartItems.length > 0
                                }
                                onChange={handleSelectAll}
                                className="w-5 h-5 rounded border-2 border-white bg-transparent focus:ring-0"
                                style={{ accentColor: '#4A90E2' }}
                            />
                        </div>
                        <div className="flex-1 text-left flex items-center">
                            Produk
                        </div>
                        <div className="w-48 text-center flex items-center justify-center">
                            Jumlah
                        </div>
                        <div className="w-32 text-center flex items-center justify-center">
                            Total Harga
                        </div>
                        <div className="w-20 text-center flex items-center justify-center">
                            Aksi
                        </div>
                    </div>
                </div>

                <div className="space-y-2 mb-8">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-gray-200 rounded-lg shadow-md"
                            style={{ height: '160px' }}
                        >
                            <div className="flex items-center h-full px-6">
                                <div className="w-16 flex justify-start items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(
                                            item.id
                                        )}
                                        onChange={() =>
                                            handleSelectItem(item.id)
                                        }
                                        className="w-5 h-5 rounded border-2 border-gray-400"
                                        style={{ accentColor: '#4A90E2' }}
                                    />
                                </div>

                                <div className="flex-1 flex items-center">
                                    <div 
                                        className="bg-white rounded-lg border-2 border-black flex items-center justify-center mr-6 flex-shrink-0"
                                        style={{ width: '100px', height: '100px' }}
                                    >
                                        <img
                                            src={getProductImageUrl(
                                                item.product
                                            )}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover rounded-md"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display =
                                                    'block';
                                            }}
                                        />
                                        <div
                                            className="text-gray-600 text-center"
                                            style={{ display: 'none' }}
                                        >
                                            <svg
                                                className="w-10 h-10"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                            >
                                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-black text-base leading-tight mb-1">
                                            {item.product.name}
                                        </h3>
                                        <p className="text-black font-semibold text-sm">
                                            Rp
                                            {new Intl.NumberFormat(
                                                'id-ID'
                                            ).format(item.product.price)}
                                        </p>
                                    </div>
                                </div>

                                <div className="w-48 flex flex-col items-center justify-center gap-2">
                                    <div className="flex items-center gap-3">
                                        {editingItemId === item.id ? (
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => {
                                                    const newQty = parseInt(
                                                        e.target.value
                                                    );
                                                    if (newQty >= 1) {
                                                        handleQuantityChange(
                                                            item.id,
                                                            newQty
                                                        );
                                                    }
                                                }}
                                                onBlur={() => setEditingItemId(null)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        setEditingItemId(null);
                                                    }
                                                }}
                                                autoFocus
                                                min="1"
                                                className="h-12 w-12 rounded-[10px] bg-white border border-gray-300 text-center text-lg font-semibold text-black"
                                            />
                                        ) : (
                                            <div
                                                onClick={() => setEditingItemId(item.id)}
                                                className="h-12 w-12 rounded-[10px] bg-white border border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                                            >
                                                <span className="text-lg font-semibold text-black">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                        )}

                                        <div className="h-7 px-2 rounded-full bg-[#415A77] text-white flex items-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.id,
                                                        item.quantity - 1
                                                    )
                                                }
                                                disabled={item.quantity <= 1}
                                                aria-label="Kurangi"
                                                className="h-4 w-4 rounded-full border border-white flex items-center justify-center mr-3 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                >
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                </svg>
                                            </button>

                                            <span className="h-4 w-px bg-white/80" />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.id,
                                                        item.quantity + 1
                                                    )
                                                }
                                                disabled={item.quantity >= item.product.stock}
                                                aria-label="Tambah"
                                                className="h-4 w-4 rounded-full border border-white flex items-center justify-center ml-3 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                >
                                                    <line x1="12" y1="5" x2="12" y2="19" />
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        Stok: {item.product.stock}
                                    </p>
                                </div>

                                <div className="w-32 flex items-center justify-center">
                                    <p className="font-semibold text-black text-sm">
                                        Rp
                                        {new Intl.NumberFormat('id-ID').format(
                                            item.product.price * item.quantity
                                        )}
                                    </p>
                                </div>

                                <div className="w-20 flex items-center justify-center">
                                    <button
                                        onClick={() =>
                                            handleRemoveItem(item.id)
                                        }
                                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
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

            <div
                className="fixed bottom-0 left-0 right-0 py-4 px-6 flex justify-end shadow-lg"
                style={{ backgroundColor: '#1B263B' }}
            >
                <button
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                    className="px-8 py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        backgroundColor:
                            selectedItems.length > 0 ? '#4A90E2' : '#6B7280',
                    }}
                >
                    Checkout
                </button>
            </div>
        </div>
    );
}

export default CartPage;