import React, { useState, useEffect, useCallback } from "react";
import axiosClient from "../../api/axiosClient";

function ManageOrdersPage() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

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
			fetchOrders();
		}
	};

	if (loading)
		return <div className="p-4 text-center">Memuat data pesanan...</div>;
	if (error)
		return (
			<div className="text-red-500 bg-red-100 p-4 rounded-md">{error}</div>
		);

	return (
		<>
			<h1 className="text-3xl font-bold text-[#001F3F] mb-6">
				Manajemen Pesanan
			</h1>

			<div className="bg-white shadow-md rounded-lg overflow-hidden">
				<table className="min-w-full">
					<thead className="bg-[#4D809E] text-white">
						<tr>
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
						{orders.map((order) => (
							<tr
								key={order.id}
								className="border-b border-gray-200 hover:bg-gray-50"
							>
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
		</>
	);
}

export default ManageOrdersPage;
