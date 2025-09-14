<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Memproses checkout dan membuat pesanan baru.
     */
    public function store(Request $request)
    {
        // 1. Validasi input alamat
        $validator = Validator::make($request->all(), [
            'address_text' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = Auth::user();
        $cart = Cart::with('items.product')->where('user_id', $user->id)->first();

        // 2. Pastikan keranjang tidak kosong
        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Keranjang Anda kosong.'], 400);
        }

        // 3. Gunakan Database Transaction untuk memastikan integritas data
        // Jika salah satu proses gagal, semua akan dibatalkan (rollback).
        try {
            $order = DB::transaction(function () use ($user, $cart, $request) {
                // 4. Hitung total harga dari item di keranjang
                $total = $cart->items->reduce(function ($carry, $item) {
                    return $carry + ($item->product->price * $item->quantity);
                }, 0);

                // 5. Buat pesanan baru (Order)
                $order = Order::create([
                    'user_id' => $user->id,
                    'order_number' => 'INV-' . time() . '-' . $user->id, // Contoh nomor pesanan sederhana
                    'total' => $total,
                    'status' => 'pending', // Status awal
                    'address_text' => $request->address_text,
                ]);

                // 6. Pindahkan item dari keranjang ke item pesanan (Order Items)
                foreach ($cart->items as $item) {
                    // Cek stok sekali lagi sebelum membuat pesanan
                    if ($item->product->stock < $item->quantity) {
                        // Batalkan transaksi jika stok tidak cukup
                        throw new \Exception('Stok untuk produk ' . $item->product->name . ' tidak mencukupi.');
                    }

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item->product_id,
                        'product_name' => $item->product->name, // Salin nama produk
                        'price' => $item->product->price,       // Salin harga produk
                        'quantity' => $item->quantity,
                        'subtotal' => $item->product->price * $item->quantity,
                    ]);

                    // 7. Kurangi stok produk
                    $item->product->decrement('stock', $item->quantity);
                }

                // 8. Kosongkan keranjang pengguna
                $cart->items()->delete();

                return $order;
            });

            // 9. Berikan respons sukses dengan data pesanan yang baru dibuat
            return response()->json($order->load('items.product'), 201);

        } catch (\Exception $e) {
            // Jika terjadi error di dalam transaksi, kembalikan pesan error
            return response()->json(['message' => 'Gagal memproses pesanan: ' . $e->getMessage()], 500);
        }
    }
}
