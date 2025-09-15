import React from "react";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

function CartPage() {
	const { cartItems, loading, updateCartItem, removeFromCart } = useCart();

	// Hitung subtotal
	const subtotal = cartItems.reduce((total, item) => {
		const price = parseFloat(item.product.price);
		return total + price * item.quantity;
	}, 0);

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
						<div key={item.id} className="flex items-center border-b py-4">
							<img
								src={item.product.image_url}
								alt={item.product.name}
								className="w-24 h-24 object-cover rounded-lg mr-4"
							/>
							<div className="flex-grow">
								<h2 className="font-bold text-lg">{item.product.name}</h2>
								<p className="text-blue-600 font-semibold">
									Rp {new Intl.NumberFormat("id-ID").format(item.product.price)}
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
					))}
				</div>

				<div className="bg-gray-100 p-6 rounded-lg h-fit shadow">
					<h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>
					<div className="flex justify-between mb-4 border-b pb-4">
						<span>Subtotal</span>
						<span>Rp {new Intl.NumberFormat("id-ID").format(subtotal)}</span>
					</div>
					<div className="border-t pt-4 flex justify-between font-bold text-lg">
						<span>Total</span>
						<span>Rp {new Intl.NumberFormat("id-ID").format(subtotal)}</span>
					</div>
					<Link
						to="/checkout"
						className="block text-center w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
					>
						Lanjut ke Checkout
					</Link>
				</div>
			</div>
		</div>
	);
}

export default CartPage;
