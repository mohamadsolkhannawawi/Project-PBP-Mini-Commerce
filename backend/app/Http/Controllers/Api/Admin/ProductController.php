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
    public function index(Request $request)
    {
        $products = Product::with('category', 'images');

        if ($request->has('category_id')) {
            $products->where('category_id', $request->category_id);
        }

        return response()->json($products->latest()->get());
    }

    public function store(StoreProductRequest $request)
    {
        $validatedData = $request->validated();
        if (empty($validatedData['slug'])) {
            $validatedData['slug'] = \Str::slug($validatedData['name']);
        }
    $validatedData['is_active'] = $request->input('is_active') === 'true' ? 1 : 0;
    $product = Product::create($validatedData);

        // Handle Primary Image
        if ($request->hasFile('primary_image')) {
            $path = $request->file('primary_image')->store('public/products');
            $product->images()->create([
                'image_path' => Storage::url($path),
                'is_primary' => true
            ]);
        }

        // Handle Gallery Images
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $image) {
                $path = $image->store('public/products');
                $product->images()->create([
                    'image_path' => Storage::url($path),
                    'is_primary' => false
                ]);
            }
        }

        return response()->json(['success' => true, 'data' => $product->load(['primaryImage', 'galleryImages'])], 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load('category', 'images'));
    }

    public function update(StoreProductRequest $request, Product $product)
    {
        $validatedData = $request->validated();
        $product->update($validatedData);
        $product->is_active = $request->input('is_active') === 'true';
        $product->save();

        // Replace images ONLY if new ones are uploaded
        if ($request->hasFile('primary_image') || $request->hasFile('gallery_images')) {
            // Delete old images from storage and DB
            foreach ($product->images as $image) {
                Storage::delete(str_replace('/storage', 'public', $image->image_path));
                $image->delete();
            }

            // Upload new primary image
            if ($request->hasFile('primary_image')) {
                $path = $request->file('primary_image')->store('public/products');
                $product->images()->create([
                    'image_path' => Storage::url($path),
                    'is_primary' => true
                ]);
            }

            // Upload new gallery images
            if ($request->hasFile('gallery_images')) {
                foreach ($request->file('gallery_images') as $image) {
                    $path = $image->store('public/products');
                    $product->images()->create([
                        'image_path' => Storage::url($path),
                        'is_primary' => false
                    ]);
                }
            }
        }

        return response()->json(['success' => true, 'data' => $product->load(['primaryImage', 'galleryImages'])]);
    }

    public function destroy(Product $product)
    {
        // Delete all associated images from storage
        foreach ($product->images as $image) {
            Storage::delete($image->image_path);
        }
        // Images in DB will be deleted automatically due to cascade on delete constraint

        $product->delete();
        return response()->json(['message' => 'Produk berhasil dihapus secara permanen.']);
    }

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

