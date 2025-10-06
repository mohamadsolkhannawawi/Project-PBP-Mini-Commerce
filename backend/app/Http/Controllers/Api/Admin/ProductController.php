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
            $path = $request->file('primary_image')->store('products', 'public');
            $product->images()->create([
                'image_path' => $path,
                'is_primary' => true
            ]);
        }

        // Handle Gallery Images
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $image) {
                $path = $image->store('products', 'public');
                $product->images()->create([
                    'image_path' => $path,
                    'is_primary' => false
                ]);
            }
        }

        return response()->json(['success' => true, 'data' => $product->load('category', 'images')], 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load('category', 'images'));
    }

    public function update(StoreProductRequest $request, Product $product)
    {
        $validatedData = $request->validated();

        if ($request->has('is_active')) {
            $validatedData['is_active'] = $request->input('is_active') === 'true';
        }

        $product->update($validatedData);

        // Handle primary image update
        if ($request->hasFile('primary_image')) {
            // Delete old primary image
            $oldPrimaryImage = $product->images()->where('is_primary', true)->first();
            if ($oldPrimaryImage) {
                Storage::disk('public')->delete($oldPrimaryImage->image_path);
                $oldPrimaryImage->delete();
            }
            
            // Upload new primary image
            $path = $request->file('primary_image')->store('products', 'public');
            $product->images()->create([
                'image_path' => $path,
                'is_primary' => true
            ]);
        }

        // Handle gallery images update
        if ($request->hasFile('gallery_images') || $request->has('keep_gallery_image_ids')) {
            // Get IDs of gallery images to keep, filter out empty values
            $keepImageIds = array_filter($request->input('keep_gallery_image_ids', []), function($id) {
                return !empty($id);
            });
            
            // Delete gallery images that are not in the keep list
            $galleryImagesToDelete = $product->images()
                ->where('is_primary', false)
                ->whereNotIn('id', $keepImageIds)
                ->get();
                
            foreach ($galleryImagesToDelete as $image) {
                Storage::disk('public')->delete($image->image_path);
                $image->delete();
            }

            // Upload new gallery images
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

    public function destroy(Product $product)
    {
        // Delete all associated images from storage
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_path);
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

