import React, { useState, useEffect, useCallback } from "react";
import axiosClient from "../../api/axiosClient";

function ManageOrdersPage() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	const fetchOrders = useCallback(async () => {
		try {
			setLoading(true);
			const response = await axiosClient.get("/admin/orders");
			setOrders(response.data);
			setError(null);
		} catch (err) {
			setError("Gagal memuat pesanan. Pastikan Anda login sebagai admin.");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchOrders();
	}, [fetchOrders]);

	const handleStatusChange = async (orderId, newStatus) => {
		try {
			await axiosClient.put(`/admin/orders/${orderId}`, { status: newStatus });
			setOrders((prevOrders) =>
				prevOrders.map((order) =>
					order.id === orderId ? { ...order, status: newStatus } : order
				)
			);
			alert("Status pesanan berhasil diperbarui.");
		} catch (err) {
			alert("Gagal memperbarui status. Silakan coba lagi.");
			fetchOrders(); // Re-fetch to get the original state if update fails
		}
	};

	// Pagination logic
	const indexOfLastOrder = currentPage * itemsPerPage;
	const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
	const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
	const totalPages = Math.ceil(orders.length / itemsPerPage);

	if (loading)
		return <div className="p-4 text-center">Memuat data pesanan...</div>;
	if (error)
		return (
			<div className="text-red-500 bg-red-100 p-4 rounded-md">{error}</div>
		);

	return (
		<>
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold text-[#001F3F]">Manajemen Pesanan</h1>
					<p className="text-gray-600">Total Pesanan: {orders.length}</p>
				</div>
			</div>

			<div className="bg-white shadow-md rounded-lg overflow-hidden">
				<table className="min-w-full">
					<thead className="bg-[#4D809E] text-white">
						<tr>
							<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">No.</th>
							<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								No. Pesanan
							</th>
							<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Pelanggan
							</th>
							<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Total
							</th>
							<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Tanggal
							</th>
							<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Status
							</th>
						</tr>
					</thead>
					<tbody className="text-gray-700">
						{currentOrders.map((order, index) => (
							<tr
								key={order.id}
								className="border-b border-gray-200 hover:bg-gray-50"
							>
								<td className="px-5 py-4">{indexOfFirstOrder + index + 1}</td>
								<td className="px-5 py-4">{order.order_number}</td>
								<td className="px-5 py-4">{order.user?.name || "N/A"}</td>
								<td className="px-5 py-4">
									Rp {new Intl.NumberFormat("id-ID").format(order.total)}
								</td>
								<td className="px-5 py-4">
									{new Date(order.created_at).toLocaleDateString("id-ID")}
								</td>
								<td className="px-5 py-4">
									<select
										value={order.status}
										onChange={(e) =>
											handleStatusChange(order.id, e.target.value)
										}
										className="border border-gray-300 rounded-md p-1 bg-white"
									>
										<option value="pending">Pending</option>
										<option value="diproses">Diproses</option>
										<option value="dikirim">Dikirim</option>
										<option value="selesai">Selesai</option>
										<option value="batal">Batal</option>
									</select>
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
		</>
	);
}

export default ManageOrdersPage;
