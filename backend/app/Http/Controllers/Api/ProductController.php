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
}

