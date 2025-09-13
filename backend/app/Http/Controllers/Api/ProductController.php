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
        // 1. Mulai query builder untuk produk
        $query = Product::query();

        // 2. Terapkan Eager Loading untuk relasi 'category' dan 'images'
        // Ini untuk mencegah masalah N+1 query dan membuat API lebih efisien.
        $query->with(['category', 'images']);

        // 3. Cek jika ada parameter pencarian (?search=...) di URL
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where('name', 'like', '%' . $searchTerm . '%');
        }

        // 4. Ambil semua produk yang aktif saja untuk ditampilkan ke publik
        $products = $query->where('is_active', true)->paginate(10); // Menggunakan paginate untuk data yang lebih besar

        // 5. Kembalikan data dalam format JSON
        return response()->json($products);
    }

    /**
     * Menampilkan detail satu produk.
     * Menggunakan Route Model Binding dari Laravel.
     */
    public function show(Product $product)
    {
        // 1. Cek apakah produk yang diminta aktif
        if (!$product->is_active) {
            return response()->json(['message' => 'Product not found or not active'], 404);
        }

        // 2. Muat relasi kategori dan gambar untuk detail
        $product->load(['category', 'images']);
        
        // 3. Kembalikan data produk tunggal sebagai JSON
        return response()->json($product);
    }
}