import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { mockProducts } from "../data/mockData";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext"; // IMPORT CUSTOM HOOK

function ProductDetailPage() {
	const { productId } = useParams();
	const { addToCart } = useCart(); // <-- DAPATKAN FUNGSI DARI CONTEXT
	const [quantity, setQuantity] = useState(1);
	const product = mockProducts.find((p) => p.id === parseInt(productId));

	const handleAddToCart = () => {
		addToCart(product, quantity);
		alert(`${quantity} ${product.name} telah ditambahkan ke keranjang!`);
	};

	if (!product) {
		return (
			<div className="text-center py-10">
				<h2>Produk tidak ditemukan!</h2>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<Link
				to="/"
				className="inline-flex items-center text-blue-600 hover:underline mb-6"
			>
				<ArrowLeft size={20} className="mr-2" />
				Kembali ke semua produk
			</Link>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div>
					<img
						src={product.imageUrl}
						alt={product.name}
						className="w-full h-auto rounded-lg shadow-lg"
					/>
				</div>
				<div>
					<h1 className="text-4xl font-bold text-gray-800 mb-4">
						{product.name}
					</h1>
					<p className="text-3xl font-light text-blue-600 mb-6">
						Rp {product.price}
					</p>
					<p className="text-gray-600 mb-6">{product.description}</p>
					<div className="flex items-center mb-6">
						<label htmlFor="quantity" className="mr-4 font-semibold">
							Jumlah:
						</label>
						<input
							type="number"
							id="quantity"
							value={quantity}
							onChange={(e) => setQuantity(parseInt(e.target.value))}
							min="1"
							className="w-20 p-2 border rounded-lg text-center"
						/>
					</div>
					<button
						onClick={handleAddToCart}
						className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 flex items-center justify-center"
					>
						<ShoppingCart size={20} className="mr-2" />
						Tambah ke Keranjang
					</button>
				</div>
			</div>
		</div>
	);
}

export default ProductDetailPage;
