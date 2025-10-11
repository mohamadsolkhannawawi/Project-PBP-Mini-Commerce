<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
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

        foreach ($categories as $categoryName) {
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
