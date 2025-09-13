<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * Menampilkan isi keranjang belanja milik pengguna yang sedang login.
     */
    public function index()
    {
        // 1. Dapatkan pengguna yang sedang login.
        $user = Auth::user();

        // 2. Cari keranjang milik pengguna tersebut.
        // Kita gunakan 'with' untuk Eager Loading, mengambil item keranjang
        // dan detail produknya sekaligus agar lebih efisien.
        $cart = Cart::with('items.product')->where('user_id', $user->id)->first();

        // 3. Kirim respon.
        // Jika pengguna belum punya keranjang (belum pernah menambah item),
        // kirim respon kosong yang valid.
        if (!$cart) {
            return response()->json(['items' => [], 'total' => 0]);
        }

        return response()->json($cart);
    }

    /**
     * Menambahkan produk ke dalam keranjang.
     * Sesuai dengan User Story 3.
     */
    public function store(Request $request)
    {
        // 1. Validasi input dari frontend.
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 2. Dapatkan pengguna dan keranjangnya.
        // 'firstOrCreate' adalah fungsi cerdas: jika pengguna belum punya keranjang,
        // maka akan dibuatkan. Jika sudah ada, akan diambil.
        $user = Auth::user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        // 3. Cek apakah produk sudah ada di keranjang.
        $cartItem = $cart->items()->where('product_id', $request->product_id)->first();

        if ($cartItem) {
            // Jika sudah ada, cukup tambahkan jumlahnya (quantity).
            $cartItem->qty += $request->qty;
            $cartItem->save();
        } else {
            // Jika belum ada, buat entri baru di tabel cart_items.
            $cartItem = $cart->items()->create([
                'product_id' => $request->product_id,
                'qty' => $request->qty,
            ]);
        }

        // 4. Kirim respon sukses.
        return response()->json([
            'message' => 'Product added to cart successfully',
            'cart_item' => $cartItem->load('product')
        ], 201);
    }

    /**
     * Mengubah jumlah (quantity) sebuah item di dalam keranjang.
     * Sesuai dengan User Story 4.
     */
    public function update(Request $request, CartItem $cartItem)
    {
        // 1. Keamanan: Pastikan item keranjang ini milik pengguna yang sedang login.
        // Ini mencegah pengguna A mengubah keranjang milik pengguna B.
        if ($cartItem->cart->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // 2. Validasi input.
        $validator = Validator::make($request->all(), [
            'qty' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        
        // 3. Update jumlah item.
        $cartItem->update(['qty' => $request->qty]);

        // 4. Kirim respon sukses.
        return response()->json([
            'message' => 'Cart item updated successfully',
            'cart_item' => $cartItem->load('product')
        ]);
    }

    /**
     * Menghapus sebuah item dari keranjang.
     * Sesuai dengan User Story 4.
     */
    public function destroy(CartItem $cartItem)
    {
        // 1. Keamanan: Sama seperti di fungsi update, pastikan item ini milik pengguna.
        if ($cartItem->cart->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // 2. Hapus item.
        $cartItem->delete();

        // 3. Kirim respon sukses tanpa konten.
        return response()->json(['message' => 'Cart item removed successfully'], 200);
    }
}