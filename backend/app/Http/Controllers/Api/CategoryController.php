<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // Get all categories (alphabetical)
    public function index()
    {
        // Retrieve all categories, ordered alphabetically by name
        $categories = Category::orderBy('name', 'asc')->get();
        return response()->json($categories);
    }

    // Get a specific category and its active products (route-model binding)
    public function show(Category $category) // Route-model binding for Category
    {
        // Eager load the products relationship, but only include products that are active
        $category->load(['products' => function ($query) {
            $query->where('is_active', true);
        }]);
        return response()->json($category);
    }
}

// backend\app\Http\Controllers\Api\CategoryController.php
