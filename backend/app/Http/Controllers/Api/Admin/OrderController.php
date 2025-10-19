<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule; // for validation rules
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // List all orders with user and items->product relations for admin
    public function index()
    {
        $orders = Order::with(['user', 'items.product']) // Eager Loading, get all related user and items with their products
            ->latest()
            ->get();
            
        return response()->json($orders);
    }

    // Update specific order status (route-model binding)
    public function update(Request $request, Order $order) // Updating specific order status, route-model binding
    {
        $validated = $request->validate([
            // if validation fails, automatic 422 response is returned, means "Unprocessable Entity"
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

// backend\app\Http\Controllers\Api\Admin\OrderController.php