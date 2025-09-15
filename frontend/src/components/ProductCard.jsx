import React from "react";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

function ProductCard({ product }) {
	const { user } = useAuth();
	const { addToCart } = useCart();

	// PERBAIKAN: Ubah menjadi fungsi async
	const handleAddToCart = async (e) => {
		e.preventDefault(); // Mencegah navigasi saat tombol diklik
		if (!user) {
			alert("Silakan login untuk menambahkan produk ke keranjang.");
			return;
		}

		try {
			// PERBAIKAN: Tunggu (await) sampai proses addToCart selesai
			await addToCart(product, 1);
			// Hanya tampilkan pesan sukses jika tidak ada error
			alert(`${product.name} telah ditambahkan ke keranjang!`);
		} catch (error) {
			// Pesan error sekarang akan ditangani di dalam CartContext
			// Biarkan kosong di sini atau tampilkan notifikasi yang lebih baik
		}
	};

	return (
		<Link
			to={`/product/${product.slug}`}
			className="block bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
		>
			<div className="w-full h-48 bg-gray-200">
				<img
					src={product.image_url}
					alt={product.name}
					className="w-full h-full object-cover"
				/>
			</div>
			<div className="p-4 flex flex-col flex-grow">
				<h3 className="font-semibold text-lg text-gray-800 flex-grow">
					{product.name}
				</h3>
				<p className="text-blue-600 font-bold text-xl my-2">
					Rp {new Intl.NumberFormat("id-ID").format(product.price)}
				</p>
				<button
					onClick={handleAddToCart}
					className="w-full mt-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center transition-colors"
				>
					<ShoppingCart size={18} className="mr-2" />
					Tambah ke Keranjang
				</button>
			</div>
		</Link>
	);
}

export default ProductCard;
