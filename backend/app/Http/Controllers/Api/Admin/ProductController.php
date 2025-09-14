<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str; // <-- Tambahkan ini

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->get();
        return response()->json($products);
    }

    public function store(StoreProductRequest $request)
    {
        $validatedData = $request->validated();
        
        // Secara otomatis membuat slug dari nama jika tidak disediakan
        if (empty($validatedData['slug'])) {
            $validatedData['slug'] = Str::slug($validatedData['name']);
        }

        $product = Product::create($validatedData);
        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load('category', 'images'));
    }

    public function update(StoreProductRequest $request, Product $product)
    {
        $validatedData = $request->validated();

        // PERBAIKAN: Secara otomatis membuat slug baru jika nama berubah
        if (isset($validatedData['name'])) {
            $validatedData['slug'] = Str::slug($validatedData['name']);
        }
        
        $product->update($validatedData);
        
        // Memuat ulang data dari database untuk memastikan respons adalah data terbaru
        return response()->json($product->fresh());
    }

    public function destroy(Product $product)
    {
        $product->is_active = false;
        $product->save();
        return response()->json(['message' => 'Produk berhasil dinonaktifkan.']);
    }
}

