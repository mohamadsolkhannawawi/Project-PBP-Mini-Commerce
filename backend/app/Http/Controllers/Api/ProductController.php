<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Menampilkan daftar semua produk.
     * Mendukung pencarian berdasarkan nama produk.
     */
    public function index(Request $request)
    {
        $query = Product::query();
        $query->with(['category', 'images']);

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where('name', 'like', '%' . $searchTerm . '%');
        }

        // PERBAIKAN: Hanya ambil produk yang statusnya 'is_active' adalah true (atau 1).
        // Ini memastikan produk yang dinonaktifkan oleh admin tidak akan tampil di frontend.
        $products = $query->where('is_active', true)->get();

        return response()->json($products);
    }

    /**
     * Menampilkan detail satu produk.
     * Menggunakan Route Model Binding dari Laravel.
     */
    public function show(Product $product)
    {
        if (!$product->is_active) {
            return response()->json(['message' => 'Product not found or not active'], 404);
        }

        $product->load(['category', 'images']);
        
        return response()->json($product);
    }
}

