<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();
        $query->with(['category', 'primaryImage', 'galleryImages']);

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where('name', 'like', '%' . $searchTerm . '%');
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        $products = $query->where('is_active', true)->get();

        return response()->json($products);
    }

    public function show($slug)
    {
        $product = Product::where('slug', $slug)
            ->with(['category', 'primaryImage', 'galleryImages'])
            ->where('is_active', true)
            ->first();
        if (!$product) {
            return response()->json(['message' => 'Product not found or not active'], 404);
        }
        return response()->json($product);
    }
}

