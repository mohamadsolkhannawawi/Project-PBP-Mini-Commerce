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
use App\Notifications\NewOrderNotification;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    // List current user's orders with items and reviews
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Order::with(['items.product', 'items.review'])
            ->where('user_id', $user->id);
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        $orders = $query->latest()->get();
        return response()->json(['data' => $orders]);
    }

    // Create order from selected cart items, decrement stock, and notify admins
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'address_text' => 'required|string|max:1000',
            'cart_item_ids' => 'required|array',
            'cart_item_ids.*' => 'integer|exists:cart_items,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = Auth::user();
        // Block admin from checkout
        if ($user && $user->role === 'admin') {
            return response()->json(['message' => 'Admin tidak dapat melakukan checkout.'], 403);
        }
        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart) {
            return response()->json(['message' => 'Keranjang tidak ditemukan.'], 404);
        }

        $cartItems = $cart->items()->with('product')->whereIn('id', $request->cart_item_ids)->get();

        if ($cartItems->isEmpty() || count($request->cart_item_ids) !== $cartItems->count()) {
            return response()->json(['message' => 'Item yang dipilih tidak valid atau tidak ada di keranjang.'], 400);
        }

        try {
            $order = DB::transaction(function () use ($user, $cartItems, $request) {
                $total = $cartItems->reduce(function ($carry, $item) {
                    if (!$item->product) {
                        throw new \Exception('Produk tidak ditemukan untuk item keranjang ID: ' . $item->id);
                    }
                    return $carry + ($item->product->price * $item->quantity);
                }, 0);

                $order = Order::create([
                    'user_id' => $user->id,
                    'order_number' => 'INV-' . time() . '-' . $user->id,
                    'total' => $total,
                    'status' => 'pending',
                    'address_text' => $request->address_text,
                ]);

                foreach ($cartItems as $item) {
                    if ($item->product->stock < $item->quantity) {
                        throw new \Exception('Stok untuk produk ' . $item->product->name . ' tidak mencukupi.');
                    }

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item->product_id,
                        'product_name' => $item->product->name,
                        'price' => $item->product->price,
                        'quantity' => $item->quantity,
                        'subtotal' => $item->product->price * $item->quantity,
                    ]);

                    $item->product->decrement('stock', $item->quantity);
                }

                Cart::where('user_id', $user->id)->first()->items()->whereIn('id', $request->cart_item_ids)->delete(); // remove only purchased items

                return $order;
            });

            try { // notify admins via database notification (see NewOrderNotification)
                $admins = User::where('role', 'admin')->get();
                foreach ($admins as $admin) {
                    $admin->notify(new NewOrderNotification($order));
                }
            } catch (\Throwable $ex) {
                \Log::error('Failed to notify admins: ' . $ex->getMessage());
            }

            return response()->json($order->load(['items.product', 'items.review']), 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal memproses pesanan: ' . $e->getMessage()], 500);
        }
    }
}

// backend\app\Http\Controllers\Api\OrderController.php
