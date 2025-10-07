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

        // Hitung total units sold (jumlah orderItems untuk produk ini)
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

    // GET /products/{id}/summary
    public function summary($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // total sold (sum quantity)
        $totalSold = $product->orderItems()->sum('quantity');

        // total orders (distinct order_id)
        $totalOrders = $product->orderItems()->distinct('order_id')->count('order_id');

        // total buyers (distinct user_id via orders)
        $totalBuyers = $product->orderItems()
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->distinct('orders.user_id')
            ->count('orders.user_id');

        // revenue
        $revenue = $product->orderItems()->sum(\DB::raw('quantity * price'));

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

    // Extended summary with recent orders and top buyers
    public function summaryV2($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $totalSold = $product->orderItems()->sum('quantity');
        $totalOrders = $product->orderItems()->distinct('order_id')->count('order_id');
        $totalBuyers = $product->orderItems()
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->distinct('orders.user_id')
            ->count('orders.user_id');
        $revenue = $product->orderItems()->sum(\DB::raw('quantity * price'));

        $recentOrders = \App\Models\Order::select('orders.*')
            ->join('order_items', 'order_items.order_id', '=', 'orders.id')
            ->where('order_items.product_id', $product->id)
            ->with('user')
            ->latest()
            ->take(5)
            ->get();

        $topBuyers = \DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->select('orders.user_id', \DB::raw('sum(order_items.quantity) as qty'))
            ->where('order_items.product_id', $product->id)
            ->groupBy('orders.user_id')
            ->orderByDesc('qty')
            ->take(5)
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
        ]);
    }
}

