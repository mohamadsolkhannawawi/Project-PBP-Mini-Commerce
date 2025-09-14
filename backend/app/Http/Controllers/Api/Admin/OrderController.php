<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Menampilkan daftar semua pesanan untuk admin.
     */
    public function index()
    {
        // Mengambil semua pesanan dengan relasi 'user' dan 'items'
        // diurutkan dari yang terbaru.
        $orders = Order::with(['user', 'items.product'])
            ->latest()
            ->get();
            
        return response()->json($orders);
    }

    /**
     * Memperbarui status pesanan.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        // Validasi otomatis dilakukan oleh UpdateOrderRequest.
        $validatedData = $request->validated();

        $order->update($validatedData);

        // Mengembalikan data pesanan yang sudah diperbarui dengan relasinya.
        return response()->json($order->load(['user', 'items.product']));
    }
}