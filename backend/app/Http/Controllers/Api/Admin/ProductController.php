<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Menampilkan daftar semua produk untuk admin.
     */
    public function index()
    {
        $products = Product::with('category')->get();
        return response()->json($products);
    }

    /**
     * Menyimpan produk baru ke database.
     */
    public function store(StoreProductRequest $request)
    {
        $validatedData = $request->validated();
        $product = Product::create($validatedData);
        return response()->json($product, 201);
    }

    /**
     * Menampilkan detail satu produk.
     */
    public function show(Product $product)
    {
        return response()->json($product->load('category', 'images'));
    }

    /**
     * Memperbarui data produk yang ada.
     */
    public function update(StoreProductRequest $request, Product $product)
    {
        $validatedData = $request->validated();
        $product->update($validatedData);
        return response()->json($product);
    }

    /**
     * Menonaktifkan produk (Soft Delete), bukan menghapus permanen.
     */
    public function destroy(Product $product)
    {
        // PERBAIKAN: Alih-alih menghapus, kita ubah status is_active menjadi false.
        $product->is_active = false;
        $product->save();
        
        // Mengembalikan respons dengan pesan sukses.
        return response()->json(['message' => 'Produk berhasil dinonaktifkan.']);
    }
}
