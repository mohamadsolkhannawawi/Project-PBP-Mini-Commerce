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
    // Get the current authenticated user's cart and its items
    public function index()
    {
        $user = Auth::user(); // Get the authenticated user
        // Eager load cart items and their associated products
        $cart = Cart::with('items.product')
            ->where('user_id', $user->id)
            ->first();

        // If the user doesn't have a cart, return an empty response
        if (!$cart) {
            return response()->json(['message' => 'Keranjang kosong.', 'items' => []]);
        }

        return response()->json($cart);
    }

    // Add a product to the cart (create or increase quantity)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id', // Check if the product exists
            'quantity' => 'required|integer|min:1', // Quantity must be at least 1
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = Auth::user();
        $product = Product::find($request->product_id);

        // Check if there is enough stock for the requested quantity
        if ($product->stock < $request->quantity) {
            return response()->json(['message' => 'Stok produk tidak mencukupi.'], 400);
        }

        // Get the user's cart or create a new one if it doesn't exist
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        // Check if the item is already in the cart
        $cartItem = $cart->items()->where('product_id', $request->product_id)->first();

        if ($cartItem) {
            // If the item exists, increment the quantity
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            // If the item doesn't exist, create a new cart item
            $cart->items()->create([
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json(['message' => 'Produk berhasil ditambahkan ke keranjang.'], 201);
    }

    // Update quantity of a cart item (route-model binding)
    public function update(Request $request, CartItem $cartItem) // Route-model binding for CartItem
    {
        // Authorization check: ensure the item belongs to the authenticated user's cart
        if ($cartItem->cart->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Check for sufficient product stock
        if ($cartItem->product->stock < $request->quantity) {
            return response()->json(['message' => 'Stok produk tidak mencukupi.'], 400);
        }

        // Update the quantity
        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return response()->json(['message' => 'Jumlah item berhasil diperbarui.', 'item' => $cartItem]);
    }

    // Remove an item from the cart (route-model binding)
    public function destroy(CartItem $cartItem) // Route-model binding for CartItem
    {
        // Authorization check: ensure the item belongs to the authenticated user's cart
        if ($cartItem->cart->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Item berhasil dihapus dari keranjang.']);
    }
}

// backend\app\Http\Controllers\Api\CartController.php

    
