<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderRequest;
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

    public function update(UpdateOrderRequest $request, Order $order)
    {
        $validatedData = $request->validated();
        $order->update($validatedData);
        
        return response()->json($order->load(['user', 'items.product']));
    }
}