<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
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
        $user = Auth::user();
        $cart = Cart::with('items.product') // Eager load untuk efisiensi
            ->where('user_id', $user->id)
            ->first();

        if (!$cart) {
            return response()->json(['message' => 'Keranjang kosong.', 'items' => []]);
        }

        return response()->json($cart);
    }

    /**
     * Menambahkan produk ke keranjang belanja pengguna.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = Auth::user();
        $product = Product::find($request->product_id);

        if ($product->stock < $request->quantity) {
            return response()->json(['message' => 'Stok produk tidak mencukupi.'], 400);
        }

        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        $cartItem = $cart->items()->where('product_id', $request->product_id)->first();

        if ($cartItem) {
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            $cart->items()->create([
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json(['message' => 'Produk berhasil ditambahkan ke keranjang.'], 201);
    }

    /**
     * Mengubah jumlah item di dalam keranjang.
     * Menggunakan Route Model Binding untuk mengambil CartItem.
     */
    public function update(Request $request, CartItem $cartItem)
    {
        // 1. Otorisasi: Pastikan pengguna hanya bisa mengubah item di keranjangnya sendiri.
        if ($cartItem->cart->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // 2. Validasi Input
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 3. Cek Stok Produk
        if ($cartItem->product->stock < $request->quantity) {
            return response()->json(['message' => 'Stok produk tidak mencukupi.'], 400);
        }

        // 4. Update Jumlah
        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return response()->json(['message' => 'Jumlah item berhasil diperbarui.', 'item' => $cartItem]);
    }

    /**
     * Menghapus item dari keranjang.
     * Menggunakan Route Model Binding untuk mengambil CartItem.
     */
    public function destroy(CartItem $cartItem)
    {
        // 1. Otorisasi: Pastikan pengguna hanya bisa menghapus item dari keranjangnya sendiri.
        if ($cartItem->cart->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // 2. Hapus Item
        $cartItem->delete();

        return response()->json(['message' => 'Item berhasil dihapus dari keranjang.']);
    }
}

    
