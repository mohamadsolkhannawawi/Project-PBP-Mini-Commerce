<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::orderBy('name', 'asc')->get();
        return response()->json($categories);
    }

    public function show(Category $category)
    {
        $category->load(['products' => function ($query) {
            $query->where('is_active', true);
        }]);
        return response()->json($category);
    }
}
