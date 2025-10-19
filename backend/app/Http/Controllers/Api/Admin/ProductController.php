<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    // List products with optional category filter
    public function index(Request $request)
    {
        $products = Product::with('category', 'images'); // Eager load category and images

        if ($request->has('category_id')) {
            $products->where('category_id', $request->category_id);
        }

        return response()->json($products->latest()->get());
    }

    // Create a new product with primary and gallery images
    public function store(StoreProductRequest $request)
    {
        $validatedData = $request->validated(); // use FormRequest to validate inputs
        if (empty($validatedData['slug'])) {
            $validatedData['slug'] = \Str::slug($validatedData['name']); // Generate slug from name if not provided
        }
        $validatedData['is_active'] = $request->input('is_active') === 'true' ? 1 : 0; // cast from string to boolean/int
        $product = Product::create($validatedData);

        // Handle primary image and gallery images
        if ($request->hasFile('primary_image')) {
            $path = $request->file('primary_image')->store('products', 'public'); // Store image in 'public/products' directory
            $product->images()->create([
                'image_path' => $path, // Save image path in database
                'is_primary' => true
            ]);
        }

        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $image) { // Loop through each uploaded gallery image
                $path = $image->store('products', 'public');
                $product->images()->create([
                    'image_path' => $path,
                    'is_primary' => false
                ]);
            }
        }

        return response()->json(['success' => true, 'data' => $product->load('category', 'images')], 201);
    }

    // Show a specific product with relations
    public function show(Product $product)
    {
        return response()->json($product->load('category', 'images'));
    }

    // Update an existing product; handle primary and gallery image changes
    public function update(StoreProductRequest $request, Product $product)
    {
        $validatedData = $request->validated();

        if ($request->has('is_active')) {
            $validatedData['is_active'] = $request->input('is_active') === 'true';
        }

        $product->update($validatedData);

        if ($request->hasFile('primary_image')) {
            $oldPrimaryImage = $product->images()->where('is_primary', true)->first(); // find existing primary image
            if ($oldPrimaryImage) {
                Storage::disk('public')->delete($oldPrimaryImage->image_path); // Delete old primary image from storage
                $oldPrimaryImage->delete(); // Remove old primary image record from database
            }
            
            $path = $request->file('primary_image')->store('products', 'public');
            $product->images()->create([
                'image_path' => $path,
                'is_primary' => true
            ]);
        }

        if ($request->hasFile('gallery_images') || $request->has('keep_gallery_image_ids')) {
            $keepImageIds = array_filter($request->input('keep_gallery_image_ids', []), function($id) { // Get IDs of gallery images to keep
                return !empty($id);
            });
            
            $galleryImagesToDelete = $product->images() // Get gallery images that are not primary and not in the keep list
                ->where('is_primary', false)
                ->whereNotIn('id', $keepImageIds)
                ->get();
                
            foreach ($galleryImagesToDelete as $image) {
                Storage::disk('public')->delete($image->image_path);
                $image->delete();
            }

            if ($request->hasFile('gallery_images')) {
                foreach ($request->file('gallery_images') as $image) {
                    $path = $image->store('products', 'public');
                    $product->images()->create([
                        'image_path' => $path,
                        'is_primary' => false
                    ]);
                }
            }
        }

        return response()->json(['success' => true, 'data' => $product->load('category', 'images')]);
    }

    // Delete a product and its images from storage
    public function destroy(Product $product)
    {
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_path); // Delete image from storage
        }

        $product->delete(); // Delete product record from database
        return response()->json(['message' => 'Produk berhasil dihapus secara permanen.']);
    }

    // Toggle product active status
    public function toggleStatus(Product $product)
    {
        $product->is_active = !$product->is_active;
        $product->save();

        $status = $product->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return response()->json([
            'message' => "Produk berhasil {$status}.",
            'product' => $product->fresh()
        ]);
    }
}

// backend\app\Http\Controllers\Api\Admin\ProductController.php