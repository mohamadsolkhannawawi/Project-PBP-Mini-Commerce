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
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'address_text' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = Auth::user();
        $cart = Cart::with('items.product')->where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Keranjang Anda kosong.'], 400);
        }

        try {
            $order = DB::transaction(function () use ($user, $cart, $request) {
                $total = $cart->items->reduce(function ($carry, $item) {
                    return $carry + ($item->product->price * $item->quantity);
                }, 0);

                $order = Order::create([
                    'user_id' => $user->id,
                    'order_number' => 'INV-' . time() . '-' . $user->id,
                    'total' => $total,
                    'status' => 'pending',
                    'address_text' => $request->address_text,
                ]);

                foreach ($cart->items as $item) {
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

                $cart->items()->delete();

                return $order;
            });

            return response()->json($order->load('items.product'), 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal memproses pesanan: ' . $e->getMessage()], 500);
        }
    }
}
