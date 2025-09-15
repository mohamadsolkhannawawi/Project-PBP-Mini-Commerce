<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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

        if (empty($validatedData['slug'])) {
            $validatedData['slug'] = Str::slug($validatedData['name']);
        }

        // Default is_active = true kalau tidak dikirim
        $validatedData['is_active'] = $validatedData['is_active'] ?? true;

        try {
            $product = Product::create($validatedData);

            if (!$product->exists) {
                return response()->json([
                    'message' => 'Gagal menyimpan produk karena alasan yang tidak diketahui.'
                ], 500);
            }

            return response()->json($product, 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat menyimpan produk ke database.',
                'error'   => $e->getMessage(),
                'data'    => $validatedData // tambahkan untuk debug
            ], 500);
        }
    }

    public function show(Product $product)
    {
        return response()->json($product->load('category', 'images'));
    }

    public function update(StoreProductRequest $request, Product $product)
    {
        $validatedData = $request->validated();

        if (isset($validatedData['name'])) {
            $validatedData['slug'] = Str::slug($validatedData['name']);
        }
        
        $product->update($validatedData);
        return response()->json($product->fresh());
    }

    public function destroy(Product $product)
    {
        $product->is_active = false;
        $product->save();
        return response()->json(['message' => 'Produk berhasil dinonaktifkan.']);
    }
}

