<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderRequest; // <-- Gunakan Form Request kita
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Menampilkan daftar semua pesanan untuk admin.
     * Sesuai dengan User Story 7.
     */
    public function index()
    {
        // Ambil semua pesanan, diurutkan dari yang terbaru.
        // Kita gunakan 'with' untuk memuat relasi data pengguna dan item-itemnya
        // agar lebih informatif di dashboard admin.
        $orders = Order::with(['user', 'items.product'])->latest()->get();

        return response()->json($orders);
    }

    /**
     * Mengupdate status pesanan.
     * Sesuai dengan User Story 8.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        // Validasi status akan dijalankan secara otomatis oleh UpdateOrderRequest.
        
        // Update status pesanan dengan data yang sudah divalidasi.
        $order->update($request->validated());

        // Kirim respon sukses beserta data pesanan yang sudah diupdate.
        return response()->json($order->load(['user', 'items.product']));
    }
}