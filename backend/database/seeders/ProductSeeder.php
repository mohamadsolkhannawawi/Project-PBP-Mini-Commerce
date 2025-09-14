<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str; // <-- Tambahkan ini

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'category_id' => 1,
                'name' => 'Smartphone Pro X',
                'description' => 'Ini adalah deskripsi standar untuk Smartphone Pro X.',
                'price' => 7500000,
                'stock' => 50,
                'image_url' => 'https://placehold.co/600x400?text=Smartphone+Pro+X',
            ],
            [
                'category_id' => 1,
                'name' => 'Laptop UltraBook 14',
                'description' => 'Ini adalah deskripsi standar untuk Laptop UltraBook 14.',
                'price' => 12500000,
                'stock' => 30,
                'image_url' => 'https://placehold.co/600x400?text=Laptop+UltraBook',
            ],
            [
                'category_id' => 2,
                'name' => 'Kemeja Formal Pria',
                'description' => 'Ini adalah deskripsi standar untuk Kemeja Formal Pria.',
                'price' => 350000,
                'stock' => 100,
                'image_url' => 'https://placehold.co/600x400?text=Kemeja+Formal',
            ],
        ];

        foreach ($products as $productData) {
            Product::create([
                'category_id' => $productData['category_id'],
                'name' => $productData['name'],
                'slug' => Str::slug($productData['name']), // <-- Tambahkan ini
                'description' => $productData['description'],
                'price' => $productData['price'],
                'stock' => $productData['stock'],
                'image_url' => $productData['image_url'],
            ]);
        }
    }
}