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
     * Menampilkan isi keranjang pengguna yang sedang login.
     */
    public function index()
    {
        $user = Auth::user();
        $cart = Cart::with('items.product')->where('user_id', $user->id)->first();

        if (!$cart) {
            return response()->json(['items' => []]);
        }

        return response()->json($cart);
    }

    /**
     * Menambahkan produk ke keranjang atau memperbarui jumlahnya jika sudah ada.
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
        $product = Product::findOrFail($request->product_id);

        // Pastikan stok mencukupi
        if ($product->stock < $request->quantity) {
            return response()->json(['message' => 'Stok produk tidak mencukupi.'], 400);
        }

        // Cari atau buat keranjang untuk pengguna
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        // Cari item di keranjang, jika sudah ada update, jika belum buat baru
        $cartItem = $cart->items()->where('product_id', $product->id)->first();

        if ($cartItem) {
            // Jika item sudah ada, tambahkan quantity
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            // Jika item belum ada, buat baru
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json(['message' => 'Produk berhasil ditambahkan ke keranjang.'], 201);
    }

    /**
     * Mengubah jumlah (quantity) dari sebuah item di keranjang.
     */
    public function update(Request $request, CartItem $cartItem)
    {
        // Pastikan item yang akan diubah adalah milik pengguna yang sedang login
        // $this->authorize('update', $cartItem);

        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        
        // Pastikan stok mencukupi
        if ($cartItem->product->stock < $request->quantity) {
            return response()->json(['message' => 'Stok produk tidak mencukupi.'], 400);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json(['message' => 'Jumlah item berhasil diperbarui.']);
    }

    /**
     * Menghapus sebuah item dari keranjang.
     */
    public function destroy(CartItem $cartItem)
    {
        // Pastikan item yang akan dihapus adalah milik pengguna yang sedang login
        // $this->authorize('delete', $cartItem);

        $cartItem->delete();

        return response()->json(['message' => 'Item berhasil dihapus dari keranjang.']);
    }
}