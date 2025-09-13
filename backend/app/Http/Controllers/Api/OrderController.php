<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Memproses checkout dan membuat pesanan baru dari keranjang pengguna.
     * Sesuai dengan User Story 5.
     */
    public function store(Request $request)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'address_text' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = Auth::user();
        
        // 2. Dapatkan keranjang pengguna beserta isinya.
        $cart = Cart::with('items.product')->where('user_id', $user->id)->first();

        // 3. Pastikan keranjang tidak kosong.
        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Your cart is empty'], 400);
        }

        try {
            // 4. Mulai Database Transaction.
            // Ini memastikan semua operasi DB di dalamnya berhasil, atau semuanya dibatalkan.
            // Sangat penting untuk proses sekompleks checkout.
            $order = DB::transaction(function () use ($cart, $user, $request) {
                // a. Hitung total harga dari semua item di keranjang.
                $totalPrice = $cart->items->sum(function ($item) {
                    return $item->qty * $item->product->price;
                });

                // b. Buat entri baru di tabel 'orders'.
                $order = Order::create([
                    'user_id' => $user->id,
                    'total' => $totalPrice,
                    'status' => 'diproses', // Status awal
                    'address_text' => $request->address_text,
                ]);

                // c. Pindahkan setiap item dari keranjang ke 'order_items'.
                foreach ($cart->items as $cartItem) {
                    $order->items()->create([
                        'product_id' => $cartItem->product_id,
                        'price' => $cartItem->product->price, // Simpan harga saat ini
                        'qty' => $cartItem->qty,
                        'subtotal' => $cartItem->qty * $cartItem->product->price,
                    ]);

                    // d. (Opsional tapi best practice) Kurangi stok produk.
                    $product = $cartItem->product;
                    if ($product->stock < $cartItem->qty) {
                        // Jika stok tidak cukup, batalkan transaksi.
                        throw new \Exception('Product stock is not sufficient for ' . $product->name);
                    }
                    $product->stock -= $cartItem->qty;
                    $product->save();
                }

                // e. Kosongkan dan hapus keranjang belanja pengguna.
                $cart->items()->delete();
                $cart->delete();

                // f. Kembalikan data pesanan yang baru dibuat.
                return $order;
            });

            // 5. Jika transaksi berhasil, kirim respon sukses.
            return response()->json([
                'message' => 'Checkout successful, order has been created',
                'order' => $order->load('items.product') // Muat relasi untuk ditampilkan
            ], 201);

        } catch (\Exception $e) {
            // 6. Jika terjadi error di dalam transaksi, kirim respon error.
            return response()->json(['message' => 'An error occurred during checkout: ' . $e->getMessage()], 500);
        }
    }
}