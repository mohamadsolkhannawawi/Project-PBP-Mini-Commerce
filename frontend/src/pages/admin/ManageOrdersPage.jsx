import React, { useState, useEffect, useCallback } from "react";
import axiosClient from "../../api/axiosClient";

function ManageOrdersPage() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [searchOrder, setSearchOrder] = useState("");
	const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
	const [statusFilter, setStatusFilter] = useState("");
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

	// Search logic
	let filteredOrders = orders.filter(
		(order) =>
			order.order_number &&
			order.order_number.toLowerCase().includes(searchOrder.toLowerCase())
	);
	if (statusFilter) {
		filteredOrders = filteredOrders.filter(
			(order) => order.status === statusFilter
		);
	}

	if (sortConfig.key) {
		filteredOrders = [...filteredOrders].sort((a, b) => {
			let aValue = a[sortConfig.key];
			let bValue = b[sortConfig.key];
			if (typeof aValue === "string") aValue = aValue.toLowerCase();
			if (typeof bValue === "string") bValue = bValue.toLowerCase();
			if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
			if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
			return 0;
		});
	}

	// Pagination logic
	const indexOfLastOrder = currentPage * itemsPerPage;
	const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
	const currentOrders = filteredOrders.slice(
		indexOfFirstOrder,
		indexOfLastOrder
	);
	const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

	if (loading)
		return <div className="p-4 text-center">Memuat data pesanan...</div>;
	if (error)
		return (
			<div className="text-red-500 bg-red-100 p-4 rounded-md">{error}</div>
		);

	// Ambil status unik dari data
	const statusOptions = Array.from(
		new Set(orders.map((order) => order.status))
	).filter(Boolean);

	return (
		<>
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold text-[#001F3F]">
						Manajemen Pesanan
					</h1>
					<p className="text-gray-600 mt-3">
						Total Pesanan: {filteredOrders.length}
					</p>
				</div>
				<div className="flex gap-2 items-center">
					<input
						type="text"
						placeholder="Cari No. Pesanan..."
						value={searchOrder}
						onChange={(e) => {
							setSearchOrder(e.target.value);
							setCurrentPage(1);
						}}
						className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
						style={{ minWidth: 200 }}
					/>
					<select
						value={statusFilter}
						onChange={(e) => {
							setStatusFilter(e.target.value);
							setCurrentPage(1);
						}}
						className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
					>
						<option value="">Semua Status</option>
						{statusOptions.map((status) => (
							<option key={status} value={status}>
								{status.charAt(0).toUpperCase() + status.slice(1)}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="bg-white shadow-md rounded-lg overflow-hidden">
				<table className="min-w-full">
					<thead className="bg-[#4D809E] text-white">
						<tr>
							<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								No.
							</th>
							<th
								className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
								onClick={() =>
									setSortConfig({
										key: "order_number",
										direction:
											sortConfig.key === "order_number" &&
											sortConfig.direction === "asc"
												? "desc"
												: "asc",
									})
								}
							>
								No. Pesanan{" "}
								{sortConfig.key === "order_number"
									? sortConfig.direction === "asc"
										? "▲"
										: "▼"
									: ""}
							</th>
							<th
								className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
								onClick={() =>
									setSortConfig({
										key: "user",
										direction:
											sortConfig.key === "user" &&
											sortConfig.direction === "asc"
												? "desc"
												: "asc",
									})
								}
							>
								Pelanggan{" "}
								{sortConfig.key === "user"
									? sortConfig.direction === "asc"
										? "▲"
										: "▼"
									: ""}
							</th>
							<th
								className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
								onClick={() =>
									setSortConfig({
										key: "total",
										direction:
											sortConfig.key === "total" &&
											sortConfig.direction === "asc"
												? "desc"
												: "asc",
									})
								}
							>
								Total{" "}
								{sortConfig.key === "total"
									? sortConfig.direction === "asc"
										? "▲"
										: "▼"
									: ""}
							</th>
							<th
								className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
								onClick={() =>
									setSortConfig({
										key: "created_at",
										direction:
											sortConfig.key === "created_at" &&
											sortConfig.direction === "asc"
												? "desc"
												: "asc",
									})
								}
							>
								Tanggal{" "}
								{sortConfig.key === "created_at"
									? sortConfig.direction === "asc"
										? "▲"
										: "▼"
									: ""}
							</th>
							<th
								className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
								onClick={() =>
									setSortConfig({
										key: "status",
										direction:
											sortConfig.key === "status" &&
											sortConfig.direction === "asc"
												? "desc"
												: "asc",
									})
								}
							>
								Status{" "}
								{sortConfig.key === "status"
									? sortConfig.direction === "asc"
										? "▲"
										: "▼"
									: ""}
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
