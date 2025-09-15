<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Menampilkan daftar semua kategori.
     * Endpoint ini bersifat publik.
     */
    public function index()
    {
        // Mengambil semua kategori dari database dan mengurutkannya berdasarkan nama
        $categories = Category::orderBy('name', 'asc')->get();
        return response()->json($categories);
    }
}
