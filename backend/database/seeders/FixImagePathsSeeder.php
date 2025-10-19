<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductImage;

// Seeder to fix image paths in ProductImage table
class FixImagePathsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void // fix path formats for images
    {
        echo "Fixing image paths...\n";
        
        ProductImage::all()->each(function ($image) {
            $originalPath = $image->image_path;
            
            if (str_starts_with($image->image_path, '/storage/')) {
                $image->image_path = str_replace('/storage/', '', $image->image_path);
                $image->save();
                echo "Fixed: {$originalPath} -> {$image->image_path}\n";
            }
            else if (str_starts_with($image->image_path, 'storage/')) {
                $image->image_path = str_replace('storage/', '', $image->image_path);
                $image->save();
                echo "Fixed: {$originalPath} -> {$image->image_path}\n";
            }
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

// backend\database\seeders\FixImagePathsSeeder.php