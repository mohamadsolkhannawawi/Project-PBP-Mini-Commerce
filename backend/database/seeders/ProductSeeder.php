<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();

        $products = [
            [
                'name' => 'Smartphone Pro X',
                'description' => 'Smartphone dengan fitur Pro, kamera canggih dan performa tinggi.',
                'price' => 7500000,
                'stock' => 50,
            ],
            [
                'name' => 'Laptop UltraBook 14',
                'description' => 'Laptop ringan dengan performa tinggi dan desain elegan.',
                'price' => 12500000,
                'stock' => 30,
            ],
            [
                'name' => 'Kemeja Formal Pria',
                'description' => 'Kemeja formal dengan bahan berkualitas untuk acara penting.',
                'price' => 350000,
                'stock' => 100,
            ],
            [
                'name' => 'Headphone Wireless X',
                'description' => 'Headphone dengan teknologi noise-cancelling dan kualitas suara superior.',
                'price' => 1200000,
                'stock' => 80,
            ],
            [
                'name' => 'Smartwatch V2',
                'description' => 'Jam tangan pintar dengan berbagai fitur kesehatan dan olahraga.',
                'price' => 1500000,
                'stock' => 60,
            ],
            [
                'name' => 'Buku Panduan Python',
                'description' => 'Buku lengkap untuk mempelajari bahasa pemrograman Python.',
                'price' => 200000,
                'stock' => 120,
            ],
            [
                'name' => 'Sepatu Lari Pria',
                'description' => 'Sepatu olahraga ringan dan nyaman untuk berlari.',
                'price' => 500000,
                'stock' => 40,
            ],
            [
                'name' => 'Tas Laptop Premium',
                'description' => 'Tas laptop dengan bahan premium dan desain elegan.',
                'price' => 600000,
                'stock' => 75,
            ],
            [
                'name' => 'Blender Dapur 500W',
                'description' => 'Blender dengan motor 500W untuk membuat smoothie dan jus segar.',
                'price' => 400000,
                'stock' => 150,
            ],
            [
                'name' => 'Mixer Elektrik 3 Kecepatan',
                'description' => 'Mixer elektrik dengan 3 kecepatan untuk membuat kue atau adonan.',
                'price' => 350000,
                'stock' => 90,
            ],
        ];

        foreach ($products as $productData) {
            $category = $categories->random();

            $slug = Str::slug($productData['name']);

            if (Product::where('slug', $slug)->exists()) {
                $slug = $slug . '-' . uniqid();
            }

            $product = Product::create([
                'category_id' => $category->id,
                'name'        => $productData['name'],
                'slug'        => $slug,
                'description' => $productData['description'],
                'price'       => $productData['price'],
                'stock'       => $productData['stock'],
                'is_active'   => true,
            ]);

            // Tidak membuat gambar jika tidak ada image_path, biarkan frontend fallback ke /no-image.webp
        }
    }
}