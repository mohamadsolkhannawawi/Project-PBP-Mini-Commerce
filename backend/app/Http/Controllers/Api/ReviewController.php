<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\OrderItem;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_item_id' => 'required|exists:order_items,id|unique:reviews,order_item_id',
            'rating' => 'required|numeric|min:1|max:5',
            'comment' => 'nullable|string'|'max:1000',
        ]);


        $orderItem = OrderItem::with('order')->find($request->order_item_id);
        if (!$orderItem || $orderItem->order->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        // Review gating: only allow review if order status is 'selesai'
        if ($orderItem->order->status !== 'selesai') {
            return response()->json(['message' => 'You can only review items from completed orders.'], 403);
        }

        $review = Review::create([
            'user_id' => auth()->id(),
            'product_id' => $request->product_id,
            'order_item_id' => $request->order_item_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json(['success' => true, 'data' => $review], 201);
    }
}
