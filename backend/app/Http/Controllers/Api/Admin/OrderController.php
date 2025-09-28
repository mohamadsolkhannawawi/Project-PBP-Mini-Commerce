<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'items.product'])
            ->latest()
            ->get();
            
        return response()->json($orders);
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                Rule::in(['pending', 'diproses', 'dikirim', 'selesai', 'batal']),
            ],
        ]);

        $order->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully.',
            'data' => $order
        ]);
    }
}