import React, { useState, useEffect, useCallback } from "react";
import axiosClient from "../../api/axiosClient";
import ProductForm from "../../components/admin/ProductForm"; // Impor komponen form

function ManageProductsPage() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// State untuk modal form
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null); // null untuk mode create, object untuk mode edit

	const fetchProducts = useCallback(async () => {
		try {
			setLoading(true);
			const response = await axiosClient.get("/admin/products");
			setProducts(response.data);
			setError(null);
		} catch (err) {
			setError("Gagal memuat produk. Pastikan Anda login sebagai admin.");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const handleSave = async (productData) => {
		try {
			if (selectedProduct) {
				// Mode Update
				await axiosClient.put(
					`/admin/products/${selectedProduct.id}`,
					productData
				);
			} else {
				// Mode Create
				await axiosClient.post("/admin/products", productData);
			}
			setIsModalOpen(false);
			setSelectedProduct(null);
			await fetchProducts(); // Muat ulang data
		} catch (err) {
			console.error("Gagal menyimpan produk:", err);
			const errorMessages = err.response?.data?.errors
				? Object.values(err.response.data.errors).flat().join(" ")
				: "Gagal menyimpan produk. Periksa kembali data Anda.";
			alert(errorMessages);
		}
	};

	const handleDelete = async (productId) => {
		if (window.confirm("Apakah Anda yakin ingin menonaktifkan produk ini?")) {
			try {
				await axiosClient.delete(`/admin/products/${productId}`);
				await fetchProducts();
			} catch (err) {
				console.error("Gagal menonaktifkan produk:", err);
				alert("Gagal menonaktifkan produk.");
			}
		}
	};

	if (loading) return <div>Memuat data produk...</div>;
	if (error) return <div className="text-red-500 p-4">{error}</div>;

	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Manajemen Produk</h1>
				<button
					onClick={() => {
						setSelectedProduct(null);
						setIsModalOpen(true);
					}}
					className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
				>
					Tambah Produk
				</button>
			</div>

			{/* Tabel Produk */}
			<div className="bg-white shadow rounded-lg overflow-x-auto">
				<table className="min-w-full leading-normal">
					<thead>
						<tr>
							<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
								Nama
							</th>
							<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
								Harga
							</th>
							<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
								Stok
							</th>
							<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
								Status
							</th>
							<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
						</tr>
					</thead>
					<tbody>
						{products.map((product) => (
							<tr key={product.id}>
								<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
									{product.name}
								</td>
								<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
									Rp {new Intl.NumberFormat("id-ID").format(product.price)}
								</td>
								<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
									{product.stock}
								</td>
								<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
									<span
										className={`px-2 py-1 font-semibold leading-tight ${
											product.is_active
												? "text-green-900 bg-green-200"
												: "text-red-900 bg-red-200"
										} rounded-full`}
									>
										{product.is_active ? "Aktif" : "Nonaktif"}
									</span>
								</td>
								<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
									<button
										onClick={() => {
											setSelectedProduct(product);
											setIsModalOpen(true);
										}}
										className="text-blue-600 hover:text-blue-900 mr-3"
									>
										Edit
									</button>
									<button
										onClick={() => handleDelete(product.id)}
										className="text-red-600 hover:text-red-900"
									>
										Nonaktifkan
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Modal untuk Form */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
						<h2 className="text-xl font-bold mb-4">
							{selectedProduct ? "Edit Produk" : "Tambah Produk Baru"}
						</h2>
						<ProductForm
							product={selectedProduct}
							onSave={handleSave}
							onCancel={() => {
								setIsModalOpen(false);
								setSelectedProduct(null);
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

export default ManageProductsPage;
