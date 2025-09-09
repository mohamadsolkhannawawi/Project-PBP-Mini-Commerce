<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Produk untuk kategori Makanan (ID: 1)
        Product::create([
            'name' => 'Nasi Goreng Spesial',
            'price' => 25000,
            'stock' => 50,
            'category_id' => 1,
            'is_active' => true,
        ]);
        Product::create([
            'name' => 'Keripik Singkong Balado',
            'price' => 15000,
            'stock' => 100,
            'category_id' => 1,
            'is_active' => true,
        ]);

        // Produk untuk kategori Minuman (ID: 2)
        Product::create([
            'name' => 'Es Kopi Susu Gula Aren',
            'price' => 18000,
            'stock' => 75,
            'category_id' => 2,
            'is_active' => true,
        ]);

        // Produk untuk kategori Kerajinan Tangan (ID: 3)
        Product::create([
            'name' => 'Tas Rotan Handmade',
            'price' => 150000,
            'stock' => 20,
            'category_id' => 3,
            'is_active' => true,
        ]);

        // Produk untuk kategori Pakaian (ID: 4)
        Product::create([
            'name' => 'Kaos Batik Pekalongan',
            'price' => 85000,
            'stock' => 40,
            'category_id' => 4,
            'is_active' => true,
        ]);
    }
}
