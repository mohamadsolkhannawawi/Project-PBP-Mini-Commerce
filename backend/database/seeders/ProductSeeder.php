<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::pluck('id');

        $products = [
            ['name' => 'Smartphone Pro X', 'price' => 7500000, 'stock' => 50],
            ['name' => 'Laptop UltraBook 14', 'price' => 12500000, 'stock' => 30],
            ['name' => 'Kemeja Lengan Panjang', 'price' => 250000, 'stock' => 100],
            ['name' => 'Gaun Musim Panas', 'price' => 450000, 'stock' => 80],
            ['name' => 'Novel Fiksi Ilmiah', 'price' => 120000, 'stock' => 200],
            ['name' => 'Vitamin C 500mg', 'price' => 80000, 'stock' => 300],
            ['name' => 'Smartwatch Series 8', 'price' => 3200000, 'stock' => 60],
            ['name' => 'Celana Jeans Pria', 'price' => 350000, 'stock' => 120],
        ];

        foreach ($products as $product) {
            Product::create([
                'name' => $product['name'],
                'slug' => Str::slug($product['name']),
                'price' => $product['price'],
                'stock' => $product['stock'],
                'description' => 'Ini adalah deskripsi standar untuk ' . $product['name'] . '.',
                'category_id' => $categories->random(),
                'image_url' => '[https://placehold.co/600x400?text=](https://placehold.co/600x400?text=)' . urlencode($product['name']),
            ]);
        }
    }
}