import React from 'react';
import { Trash2 } from 'lucide-react';

function CartItem({
    item,
    updateCartItem,
    removeFromCart,
    onSelectItem,
    isSelected,
}) {
    return (
        <div className="flex items-center border-b py-4">
            <input
                type="checkbox"
                className="h-5 w-5 mr-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={isSelected}
                onChange={() => onSelectItem(item.id)}
            />
            <img
                src={item.product.image_url}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-lg mr-4"
            />
            <div className="flex-grow">
                <h2 className="font-bold text-lg">{item.product.name}</h2>
                <p className="text-blue-600 font-semibold">
                    Rp{' '}
                    {new Intl.NumberFormat('id-ID').format(item.product.price)}
                </p>
            </div>
            <div className="flex items-center">
                <input
                    type="number"
                    className="w-16 text-center border rounded mx-4"
                    value={item.quantity}
                    onChange={(e) =>
                        updateCartItem(item.id, parseInt(e.target.value))
                    }
                    min="1"
                />
                <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                >
                    <Trash2 size={24} />
                </button>
            </div>
        </div>
    );
}

export default CartItem;
