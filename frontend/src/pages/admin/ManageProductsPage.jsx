import React, { useState, useEffect, useCallback } from "react";
import axiosClient from "../../api/axiosClient";
import ProductForm from "../../components/admin/ProductForm";

function ManageProductsPage() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);

	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

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
		const dataToSave = { ...productData, is_active: !!productData.is_active };
		try {
			if (selectedProduct) {
				await axiosClient.put(
					`/admin/products/${selectedProduct.id}`,
					dataToSave
				);
			} else {
				await axiosClient.post("/admin/products", dataToSave);
			}
			setIsModalOpen(false);
			setSelectedProduct(null);
			await fetchProducts();
		} catch (err) {
			const errorMessages = err.response?.data?.errors
				? Object.values(err.response.data.errors).flat().join(" \n")
				: "Gagal menyimpan produk. Periksa kembali data Anda.";
			alert(errorMessages);
		}
	};

	const handleToggleStatus = async (product) => {
		try {
			const response = await axiosClient.patch(
				`/admin/products/${product.id}/toggle-status`
			);
			setProducts((prevProducts) =>
				prevProducts.map((p) =>
						p.id === product.id ? response.data.product : p
				)
			);
		} catch (err) {
			alert("Gagal mengubah status produk.");
		}
	};

	const handlePermanentDelete = async (productId) => {
		if (
			window.confirm(
				"Apakah Anda yakin ingin menghapus produk ini secara permanen? Tindakan ini tidak dapat diurungkan."
			)
		) {
			try {
				await axiosClient.delete(`/admin/products/${productId}`);
				setProducts((prevProducts) =>
					prevProducts.filter((p) => p.id !== productId)
				);
			} catch (err) {
				alert("Gagal menghapus produk.");
			}
		}
	};

	// Pagination logic
	const indexOfLastProduct = currentPage * itemsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
	const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
	const totalPages = Math.ceil(products.length / itemsPerPage);

	if (loading) 
		return <div className="p-4 text-center">Memuat data produk...</div>;
	if (error)
		return (
			<div className="text-red-500 bg-red-100 p-4 rounded-md">{error}</div>
		);

	return (
		<>
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold text-[#001F3F]">Manajemen Produk</h1>
					<p className="text-gray-600">Total Produk: {products.length}</p>
				</div>
				<button
					onClick={() => {
						setSelectedProduct(null);
						setIsModalOpen(true);
					}}
					className="bg-[#F07167] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
				>
					+ Tambah Produk
				</button>
			</div>

			<div className="bg-white shadow-md rounded-lg overflow-hidden">
				<table className="min-w-full">
					<thead className="bg-[#4D809E] text-white">
						<tr>
							<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">No.</th>
							<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Nama Produk
							</th>
							<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Kategori
							</th>
							<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Harga
							</th>
							<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Stok
							</th>
							<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Status
							</th>
							<th className="px-5 py-3"></th>
						</tr>
					</thead>
					<tbody className="text-gray-700">
						{currentProducts.map((product, index) => (
							<tr
								key={product.id}
								className="border-b border-gray-200 hover:bg-gray-50"
							>
								<td className="px-5 py-4">{indexOfFirstProduct + index + 1}</td>
								<td className="px-5 py-4">{product.name}</td>
								<td className="px-5 py-4">{product.category?.name || "N/A"}</td>
								<td className="px-5 py-4">
									Rp {new Intl.NumberFormat("id-ID").format(product.price)}
								</td>
								<td className="px-5 py-4">{product.stock}</td>
								<td className="px-5 py-4">
									<span
										className={`px-2 py-1 text-xs font-semibold leading-tight ${product.is_active
												? "text-green-700 bg-green-100"
												: "text-red-700 bg-red-100"
										}
											rounded-full`}
									>
										{product.is_active ? "Aktif" : "Nonaktif"}
									</span>
								</td>
								<td className="px-5 py-4 text-right flex items-center">
									<button
										onClick={() => {
											setSelectedProduct(product);
											setIsModalOpen(true);
										}}
										className="text-[#4D809E] hover:underline mr-4"
									>
										Edit
									</button>
									<button
										onClick={() => handleToggleStatus(product)}
										className={`hover:underline mr-4 ${product.is_active
												? "text-yellow-600"
												: "text-green-600"
										}
										`}
									>
										{product.is_active ? "Nonaktifkan" : "Aktifkan"}
									</button>
									<button
										onClick={() => handlePermanentDelete(product.id)}
										className="text-red-600 hover:underline"
									>
										🗑️
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{totalPages > 1 && (
				<div className="flex justify-between items-center mt-4">
					<button
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
						disabled={currentPage === 1}
						className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md disabled:opacity-50"
					>
						Back
					</button>
					<span>
						Halaman {currentPage} dari {totalPages}
					</span>
					<button
						onClick={() =>
							setCurrentPage((prev) => Math.min(prev + 1, totalPages))
						}
						disabled={currentPage === totalPages}
						className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md disabled:opacity-50"
					>
						Next
					</button>
				</div>
			)}

			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
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
		</>
	);
}

export default ManageProductsPage;
