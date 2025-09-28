import React from 'react';
import { Trash2 } from 'lucide-react';

function CartItem({
    item,
    updateCartItem,
    removeFromCart,
    onSelectItem,
    isSelected,
}) {
    const handleQuantityChange = (newQuantity) => {
        if (newQuantity > 0 && newQuantity <= item.product.stock) {
            updateCartItem(item.id, newQuantity);
        }
    };

    const imageUrl = item.product.primary_image?.image_path
        ? `http://localhost:8000/storage/${item.product.primary_image.image_path.replace(
              'public/',
              ''
          )}`
        : `https://via.placeholder.com/600x600.png?text=${encodeURIComponent(
              item.product.name || 'Produk'
          )}`;
    return (
        <div className="flex items-center border-b py-4">
            <input
                type="checkbox"
                className="h-5 w-5 mr-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={isSelected}
                onChange={() => onSelectItem(item.id)}
            />
            <img
                src={imageUrl}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-lg mr-4"
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://via.placeholder.com/600x600.png?text=${encodeURIComponent(
                        item.product.name || 'Produk'
                    )}`;
                }}
            />
            <div className="flex-grow">
                <h2 className="font-bold text-lg">{item.product.name}</h2>
                <p className="text-blue-600 font-semibold">
                    Rp{' '}
                    {new Intl.NumberFormat('id-ID').format(item.product.price)}
                </p>
            </div>
            <div className="flex flex-col items-end">
                <div className="flex items-center">
                    <div className="flex items-center border rounded-lg">
                        <button
                            onClick={() =>
                                handleQuantityChange(item.quantity - 1)
                            }
                            className="px-3 py-1 border-r bg-gray-100 hover:bg-gray-200 rounded-l-lg"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (isNaN(value)) {
                                    handleQuantityChange(1);
                                } else {
                                    handleQuantityChange(value);
                                }
                            }}
                            min="1"
                            max={item.product.stock}
                            className="w-16 p-2 text-center"
                        />
                        <button
                            onClick={() =>
                                handleQuantityChange(item.quantity + 1)
                            }
                            className="px-3 py-1 border-l bg-gray-100 hover:bg-gray-200 rounded-r-lg"
                        >
                            +
                        </button>
                    </div>
                    <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 ml-4"
                    >
                        <Trash2 size={24} />
                    </button>
                </div>
                <p className="text-gray-600 mt-2 text-sm">
                    Stok: {item.product.stock}
                </p>
            </div>
        </div>
    );
}

export default CartItem;
