<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category'])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->where('is_active', true);

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where('name', 'like', '%' . $searchTerm . '%');
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        $products = $query->withCount('orderItems')->paginate(12);

        return response()->json(['success' => true, 'data' => $products]);
    }

    public function show($slug)
    {
        $product = Product::where('slug', $slug)
            ->with(['category', 'reviews.user'])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->withCount('orderItems')
            ->where('is_active', true)
            ->first();
        if (!$product) {
            return response()->json(['message' => 'Product not found or not active'], 404);
        }
        return response()->json(['success' => true, 'data' => $product]);
    }

    public function summary($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $totalSold = (int) \DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('order_items.product_id', $product->id)
            ->where('orders.status', 'selesai')
            ->sum('order_items.quantity');

        $totalOrders = (int) \DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('order_items.product_id', $product->id)
            ->where('orders.status', 'selesai')
            ->distinct('order_items.order_id')
            ->count('order_items.order_id');

        $totalBuyers = (int) \DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('order_items.product_id', $product->id)
            ->where('orders.status', 'selesai')
            ->distinct('orders.user_id')
            ->count('orders.user_id');

        $revenue = (float) \DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('order_items.product_id', $product->id)
            ->where('orders.status', 'selesai')
            ->select(\DB::raw('COALESCE(SUM(order_items.quantity * order_items.price), 0) as revenue'))
            ->value('revenue');

        return response()->json([
            'product_id' => $product->id,
            'product_name' => $product->name,
            'stock' => $product->stock,
            'total_sold' => (int) $totalSold,
            'total_orders' => (int) $totalOrders,
            'total_buyers' => (int) $totalBuyers,
            'revenue' => (float) $revenue,
        ]);
    }

    public function summaryV2($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $completed = \DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('order_items.product_id', $product->id)
            ->where('orders.status', 'selesai');

        $totalSold = (int) $completed->sum('order_items.quantity');

        $totalOrders = (int) $completed->distinct('order_items.order_id')->count('order_items.order_id');

        $totalBuyers = (int) $completed->distinct('orders.user_id')->count('orders.user_id');

        $revenue = (float) \DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('order_items.product_id', $product->id)
            ->where('orders.status', 'selesai')
            ->select(\DB::raw('COALESCE(SUM(order_items.quantity * order_items.price), 0) as revenue'))
            ->value('revenue');

        $recentOrders = \App\Models\Order::select('orders.*')
            ->join('order_items', 'order_items.order_id', '=', 'orders.id')
            ->where('order_items.product_id', $product->id)
            ->where('orders.status', 'selesai')
            ->with('user')
            ->latest()
            ->take(5)
            ->get();

        $topBuyers = \DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('users', 'orders.user_id', '=', 'users.id')
            ->select('users.id as user_id', 'users.name', \DB::raw('sum(order_items.quantity) as qty'))
            ->where('order_items.product_id', $product->id)
            ->where('orders.status', 'selesai')
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('qty')
            ->take(5)
            ->get();

        $lineItems = \DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->select(
                'order_items.id',
                'order_items.order_id',
                'order_items.quantity',
                'order_items.price',
                \DB::raw('order_items.quantity * order_items.price as line_total'),
                'orders.created_at'
            )
            ->where('order_items.product_id', $product->id)
            ->where('orders.status', 'selesai')
            ->orderByDesc('orders.created_at')
            ->take(10)
            ->get();

        return response()->json([
            'product_id' => $product->id,
            'product_name' => $product->name,
            'stock' => $product->stock,
            'total_sold' => (int) $totalSold,
            'total_orders' => (int) $totalOrders,
            'total_buyers' => (int) $totalBuyers,
            'revenue' => (float) $revenue,
            'recent_orders' => $recentOrders,
            'top_buyers' => $topBuyers,
            'line_items' => $lineItems,
        ]);
    }
}

