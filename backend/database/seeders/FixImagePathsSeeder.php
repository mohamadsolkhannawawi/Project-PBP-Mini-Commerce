<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductImage;

class FixImagePathsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        echo "Fixing image paths...\n";
        
        ProductImage::all()->each(function ($image) {
            $originalPath = $image->image_path;
            
            // Convert from /storage/products/filename.jpg to products/filename.jpg
            if (str_starts_with($image->image_path, '/storage/')) {
                $image->image_path = str_replace('/storage/', '', $image->image_path);
                $image->save();
                echo "Fixed: {$originalPath} -> {$image->image_path}\n";
            }
            // Convert from storage/products/filename.jpg to products/filename.jpg
            else if (str_starts_with($image->image_path, 'storage/')) {
                $image->image_path = str_replace('storage/', '', $image->image_path);
                $image->save();
                echo "Fixed: {$originalPath} -> {$image->image_path}\n";
            }
            // If path already looks correct, skip
            else if (str_starts_with($image->image_path, 'products/')) {
                echo "Already correct: {$image->image_path}\n";
            }
            else {
                echo "Unknown format, skipping: {$image->image_path}\n";
            }
        });
        
        echo "Image paths fixing completed!\n";
    }
}