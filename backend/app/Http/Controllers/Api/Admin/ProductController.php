<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest; // <-- Gunakan Form Request kita
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Menampilkan daftar semua produk untuk admin.
     */
    public function index()
    {
        // Ambil semua produk, termasuk data kategorinya.
        $products = Product::with('category')->get();
        return response()->json($products);
    }

    /**
     * Menyimpan produk baru ke dalam database.
     * Sesuai dengan User Story 6.
     */
    public function store(StoreProductRequest $request)
    {
        // Validasi akan dijalankan secara otomatis oleh StoreProductRequest.
        // Jika validasi gagal, Laravel akan mengirim respon error 422 secara otomatis.
        
        // Jika validasi berhasil, kita buat produk baru.
        $product = Product::create($request->validated());

        // Kirim respon sukses beserta data produk yang baru dibuat.
        return response()->json($product->load('category'), 201);
    }

    /**
     * Menampilkan detail satu produk spesifik.
     */
    public function show(Product $product)
    {
        // Gunakan Route Model Binding untuk mengambil produk.
        return response()->json($product->load('category'));
    }

    /**
     * Mengupdate data produk yang sudah ada.
     * Sesuai dengan User Story 6.
     */
    public function update(StoreProductRequest $request, Product $product)
    {
        // Validasi dijalankan oleh StoreProductRequest.
        
        // Update produk dengan data yang sudah divalidasi.
        $product->update($request->validated());

        // Kirim respon sukses beserta data produk yang sudah diupdate.
        return response()->json($product->load('category'));
    }

    /**
     * Menghapus produk dari database.
     * Sesuai dengan User Story 6.
     */
    public function destroy(Product $product)
    {
        // Hapus produk.
        $product->delete();

        // Kirim respon sukses tanpa konten.
        return response()->json(['message' => 'Product deleted successfully'], 200);
    }
}