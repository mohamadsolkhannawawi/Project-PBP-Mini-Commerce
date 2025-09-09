<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Menampilkan daftar semua produk.
     * Fungsi ini juga menangani fungsionalitas pencarian.
     * Sesuai dengan User Story 1 & 2.
     */
    public function index(Request $request)
    {
        // 1. Mulai Query
        // Kita mulai dengan query builder untuk tabel produk.
        // Kita gunakan 'with('category')' untuk 'Eager Loading'. Ini sangat efisien
        // karena mengambil semua produk beserta data kategorinya dalam satu query,
        // mencegah masalah N+1 query.
        $query = Product::with('category');

        // 2. Logika Pencarian (Search)
        // Kita periksa apakah ada parameter 'search' di URL request.
        if ($request->has('search')) {
            $searchTerm = $request->search;
            // Jika ada, kita tambahkan kondisi 'where' pada query.
            // Kita mencari di kolom 'name' produk ATAU di kolom 'name' pada tabel relasi 'category'.
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                  ->orWhereHas('category', function ($subQuery) use ($searchTerm) {
                      $subQuery->where('name', 'like', '%' . $searchTerm . '%');
                  });
            });
        }
        
        // 3. Eksekusi Query dan Kirim Respon
        // Kita ambil semua produk yang sesuai dengan query (bisa difilter atau tidak)
        // dan mengembalikannya sebagai respon JSON.
        $products = $query->get();

        return response()->json($products);
    }

    /**
     * Menampilkan detail satu produk.
     */
    public function show(Product $product)
    {
        // Berkat 'Route Model Binding' Laravel, kita tidak perlu mencari produk manual.
        // Laravel secara otomatis mengambil data produk dari database berdasarkan ID di URL
        // dan memasukkannya ke dalam variabel $product.
        // Jika produk tidak ditemukan, Laravel akan otomatis mengirim respon 404 Not Found.
        
        // Kita muat juga relasi kategorinya untuk ditampilkan di detail.
        return response()->json($product->load('category'));
    }
}