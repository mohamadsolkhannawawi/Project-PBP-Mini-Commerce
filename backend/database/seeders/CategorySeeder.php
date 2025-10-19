<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

// Seeder for default categories
class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void // create categories with unique slugs
    {
        $categories = [
            'Elektronik',
            'Fashion Pria',
            'Fashion Wanita',
            'Buku',
            'Olahraga',
            'Makanan & Minuman',
            'Kesehatan & Kecantikan',
            'Peralatan Rumah Tangga',
            'Mainan Anak',
            'Otomotif',
            'Komputer & Aksesoris',
            'Gadget',
            'Furniture',
            'Hobi & Kerajinan',
            'Musik & Audio'
        ];

        foreach ($categories as $categoryName) { // ensure slug uniqueness
            $slug = Str::slug($categoryName);
            
            $existingCategory = Category::where('slug', $slug)->first();
            
            if ($existingCategory) {
                $slug = $slug . '-' . uniqid();
            }

            Category::create([
                'name' => $categoryName,
                'slug' => $slug,
            ]);
        }
    }
}

// backend\database\seeders\CategorySeeder.php
