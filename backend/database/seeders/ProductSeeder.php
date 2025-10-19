<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

// Seeder for default products (with categories)
class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void // create products for each category
    {
        $categories = Category::pluck('id', 'name');

    $productsData = [ // product data grouped by category
            [
                'category_name' => 'Elektronik',
                'name' => 'Smart TV 4K 55 Inch',
                'description' => 'Rasakan pengalaman sinematik di rumah dengan Smart TV 4K. Didukung prosesor canggih, TV ini menghasilkan kontras luar biasa dan warna natural yang hidup. Akses berbagai aplikasi hiburan dengan mudah melalui sistem operasi yang intuitif.',
                'price' => 7899000,
                'stock' => 45,
            ],
            [
                'category_name' => 'Elektronik',
                'name' => 'AC Split 1 PK Inverter',
                'description' => 'Nikmati udara sejuk yang hemat energi dengan AC berteknologi Inverter. Mampu mendinginkan ruangan dengan cepat dan menjaga suhu tetap stabil tanpa lonjakan daya listrik. Dilengkapi filter anti-bakteri untuk udara yang lebih bersih dan sehat.',
                'price' => 4250000,
                'stock' => 60,
            ],

            [
                'category_name' => 'Fashion Pria',
                'name' => 'Kemeja Pria Lengan Pendek',
                'description' => 'Kemeja kasual lengan pendek yang terbuat dari bahan katun premium, memberikan kenyamanan maksimal sepanjang hari. Dengan potongan modern fit, kemeja ini cocok untuk berbagai acara santai maupun semi-formal.',
                'price' => 220000,
                'stock' => 200,
            ],
            [
                'category_name' => 'Fashion Pria',
                'name' => 'Sneakers Pria Kasual',
                'description' => 'Sepatu sneakers dengan desain minimalis dan modern. Dibuat dengan material kanvas berkualitas dan sol karet anti-slip yang fleksibel, memberikan kenyamanan untuk aktivitas harian Anda. Mudah dipadukan dengan berbagai gaya pakaian.',
                'price' => 380000,
                'stock' => 120,
            ],

            [
                'category_name' => 'Fashion Wanita',
                'name' => 'Blouse Wanita Lengan Panjang',
                'description' => 'Blouse elegan dengan bahan katun rayon yang jatuh dan adem. Desainnya yang simpel namun menawan membuatnya cocok untuk dipakai ke kantor maupun acara santai. Tersedia dalam berbagai pilihan warna pastel yang lembut.',
                'price' => 185000,
                'stock' => 180,
            ],
            [
                'category_name' => 'Fashion Wanita',
                'name' => 'Tas Bahu (Shoulder Bag)',
                'description' => 'Tas bahu dengan desain klasik yang tak lekang oleh waktu. Kompartemen utama yang luas cukup untuk membawa barang esensial harian Anda. Dibuat dari kulit sintetis premium yang tahan lama dan mudah dirawat.',
                'price' => 299000,
                'stock' => 90,
            ],

            [
                'category_name' => 'Buku',
                'name' => 'Buku "Filosofi Teras"',
                'description' => 'Jelajahi kearifan kuno yang relevan untuk kehidupan modern. Buku ini membahas prinsip-prinsip Stoisisme yang dapat membantu Anda mengatasi emosi negatif dan menghasilkan ketenangan mental. Sebuah bacaan penting yang akan mengubah cara Anda memandang masalah.',
                'price' => 98000,
                'stock' => 250,
            ],
            [
                'category_name' => 'Buku',
                'name' => 'Novel Fiksi "Bumi"',
                'description' => 'Novel fantasi karya Tere Liye yang menjadi pembuka dari serial "Dunia Paralel". Menceritakan petualangan Raib, seorang remaja yang memiliki kekuatan menghilang, bersama dua temannya, Seli dan Ali, di dunia yang penuh keajaiban.',
                'price' => 99000,
                'stock' => 220,
            ],

            [
                'category_name' => 'Olahraga',
                'name' => 'Sepatu Lari Pria',
                'description' => 'Nikmati sensasi lari yang lebih ringan dan nyaman. Sepatu ini dirancang untuk memberikan kenyamanan maksimal berkat bantalan busa EVA yang responsif dan tebal. Bagian atasnya menggunakan bahan mesh yang sejuk untuk menjaga kaki tidak gerah.',
                'price' => 750000,
                'stock' => 90,
            ],
            [
                'category_name' => 'Olahraga',
                'name' => 'Matras Yoga Anti-Slip',
                'description' => 'Matras yoga dengan ketebalan 6mm yang memberikan bantalan optimal untuk sendi Anda. Permukaannya memiliki tekstur anti-slip yang menjamin stabilitas dan keamanan saat melakukan berbagai pose. Terbuat dari bahan TPE yang ramah lingkungan.',
                'price' => 250000,
                'stock' => 150,
            ],

            [
                'category_name' => 'Makanan & Minuman',
                'name' => 'Madu Hutan Murni 500ml',
                'description' => 'Madu murni yang dipanen dari hutan multiflora, menghasilkan rasa manis yang kaya dan aroma floral yang khas. Tanpa tambahan gula atau pengawet, madu ini baik untuk menjaga daya tahan tubuh dan sebagai pemanis alami.',
                'price' => 120000,
                'stock' => 130,
            ],
            [
                'category_name' => 'Makanan & Minuman',
                'name' => 'Keripik Tempe Sagu 250g',
                'description' => 'Camilan tradisional yang renyah dan gurih. Dibuat dari tempe berkualitas yang diiris tipis dan dibalut dengan tepung sagu, kemudian digoreng hingga keemasan. Cocok sebagai teman minum teh atau camilan di waktu santai.',
                'price' => 35000,
                'stock' => 300,
            ],

            [
                'category_name' => 'Kesehatan & Kecantikan',
                'name' => 'Serum Wajah Niacinamide',
                'description' => 'Serum pencerah yang diformulasikan dengan 10% Niacinamide untuk membantu menyamarkan noda hitam dan mengontrol produksi minyak. Diperkaya dengan ekstrak pelembap untuk menjaga kulit tetap kenyal dan sehat.',
                'price' => 135000,
                'stock' => 250,
            ],
            [
                'category_name' => 'Kesehatan & Kecantikan',
                'name' => 'Sunscreen SPF 50 PA++++',
                'description' => 'Tabir surya dengan perlindungan tinggi terhadap sinar UVA dan UVB. Formulanya ringan, tidak lengket, dan tidak meninggalkan noda putih (white cast). Cocok untuk semua jenis kulit dan nyaman digunakan setiap hari.',
                'price' => 85000,
                'stock' => 400,
            ],

            [
                'category_name' => 'Peralatan Rumah Tangga',
                'name' => 'Air Fryer Digital 4L',
                'description' => 'Nikmati makanan lezat dan renyah dengan lemak hingga 90% lebih sedikit. Air fryer ini menggunakan sirkulasi udara panas untuk menggoreng dan memanggang. Dengan layar sentuh digital, memasak hidangan sehat menjadi lebih mudah.',
                'price' => 950000,
                'stock' => 70,
            ],
            [
                'category_name' => 'Peralatan Rumah Tangga',
                'name' => 'Blender Kaca 1.5 Liter',
                'description' => 'Blender dengan tabung kaca tebal yang tidak mudah tergores dan tidak meninggalkan bau. Dilengkapi mata pisau tajam dari stainless steel untuk menghaluskan buah, sayur, hingga es batu dengan cepat. Mudah dibersihkan dan aman.',
                'price' => 480000,
                'stock' => 100,
            ],
            
            [
                'category_name' => 'Mainan Anak',
                'name' => 'Mainan Balok Kreatif',
                'description' => 'Buka dunia kreativitas tanpa batas dengan kotak balok ini. Berisi ratusan keping dalam berbagai warna dan bentuk untuk membangun apa saja yang bisa dibayangkan. Dikemas dalam kotak penyimpanan yang praktis, ini adalah set awal yang sempurna.',
                'price' => 450000,
                'stock' => 100,
            ],
            [
                'category_name' => 'Mainan Anak',
                'name' => 'Mobil Remote Control Off-Road',
                'description' => 'Mobil RC dengan desain tangguh untuk melibas berbagai medan. Dilengkapi suspensi independen dan ban karet besar, mobil ini mampu bergerak lincah di permukaan tidak rata. Memberikan pengalaman bermain yang seru dan menantang.',
                'price' => 350000,
                'stock' => 80,
            ],

            [
                'category_name' => 'Otomotif',
                'name' => 'Dashcam Mobil Full HD',
                'description' => 'Rekam setiap momen perjalanan Anda dengan kejernihan luar biasa. Dashcam ini merekam dalam resolusi Full HD, didukung oleh sensor gambar yang andal. Memberikan bukti rekaman yang jelas untuk keamanan dan ketenangan saat berkendara.',
                'price' => 899000,
                'stock' => 95,
            ],
            [
                'category_name' => 'Otomotif',
                'name' => 'Pengharum Mobil Aroma Kopi',
                'description' => 'Pengharum mobil dengan ekstrak biji kopi asli yang efektif menetralisir bau tidak sedap. Memberikan aroma kopi yang menenangkan dan menyegarkan di dalam kabin mobil Anda, membuat perjalanan lebih menyenangkan.',
                'price' => 55000,
                'stock' => 500,
            ],

            [
                'category_name' => 'Komputer & Aksesoris',
                'name' => 'Mouse Wireless Ergonomis',
                'description' => 'Mouse presisi yang dirancang untuk kenyamanan. Mouse ini dilengkapi sensor optik akurat yang dapat melacak di hampir semua permukaan. Desain ergonomisnya memastikan kenyamanan tangan bahkan setelah penggunaan berjam-jam.',
                'price' => 425000,
                'stock' => 150,
            ],
            [
                'category_name' => 'Komputer & Aksesoris',
                'name' => 'Keyboard Mechanical TKL',
                'description' => 'Keyboard mekanikal dengan layout Tenkeyless (TKL) yang ringkas, memberikan lebih banyak ruang di meja Anda. Memberikan pengalaman mengetik yang taktil dan responsif, ideal untuk gaming maupun pekerjaan profesional.',
                'price' => 750000,
                'stock' => 110,
            ],

            [
                'category_name' => 'Gadget',
                'name' => 'Smartphone Mid-range 128GB',
                'description' => 'Smartphone dengan performa seimbang untuk kebutuhan harian. Ditenagai oleh prosesor yang efisien, layar jernih, dan baterai besar. Sistem kamera serbaguna yang mampu menangkap momen dengan baik dalam berbagai kondisi.',
                'price' => 3499000,
                'stock' => 150,
            ],
            [
                'category_name' => 'Gadget',
                'name' => 'Powerbank 10000mAh Fast Charging',
                'description' => 'Pengisi daya portabel dengan kapasitas 10000mAh yang ringkas. Mendukung teknologi fast charging untuk mengisi daya perangkat Anda dengan cepat. Dilengkapi dua port output untuk mengisi daya dua perangkat sekaligus.',
                'price' => 250000,
                'stock' => 300,
            ],

            [
                'category_name' => 'Furniture',
                'name' => 'Rak Buku Minimalis',
                'description' => 'Sebuah solusi penyimpanan klasik yang fungsional. Rak buku ini memiliki desain sederhana dan tak lekang oleh waktu yang cocok untuk berbagai interior. Ambalan yang dapat diatur memungkinkan Anda menyesuaikan ruang sesuai kebutuhan.',
                'price' => 599000,
                'stock' => 130,
            ],
            [
                'category_name' => 'Furniture',
                'name' => 'Meja Kerja Modern 120cm',
                'description' => 'Meja kerja dengan desain modern minimalis. Permukaan meja yang luas terbuat dari particle board grade A. Rangka kaki dari besi yang kokoh, memberikan stabilitas dan durabilitas. Cocok untuk setup kerja atau belajar di rumah.',
                'price' => 850000,
                'stock' => 75,
            ],

            [
                'category_name' => 'Hobi & Kerajinan',
                'name' => 'Model Kit Mini 4WD',
                'description' => 'Masuki dunia balap Mini 4WD dengan model kit ini. Menggunakan sasis yang canggih untuk keseimbangan dan stabilitas superior di lintasan. Merakit mobil ini dari awal memberikan pengalaman yang memuaskan bagi para penghobi.',
                'price' => 150000,
                'stock' => 160,
            ],
            [
                'category_name' => 'Hobi & Kerajinan',
                'name' => 'Set Cat Akrilik 12 Warna',
                'description' => 'Satu set cat akrilik berisi 12 warna dasar yang cerah dan memiliki pigmentasi tinggi. Cepat kering dan tahan air setelah kering. Cocok digunakan di berbagai media seperti kanvas, kertas, kayu, dan kain.',
                'price' => 95000,
                'stock' => 220,
            ],

            [
                'category_name' => 'Musik & Audio',
                'name' => 'Headphone Noise Cancelling',
                'description' => 'Masuki dunia audio imersif dengan headphone Bluetooth ini. Dilengkapi fitur Active Noise Cancelling (ANC) untuk meredam suara bising dari luar. Nikmati kualitas suara jernih dan bass yang dalam serta desain yang nyaman.',
                'price' => 950000,
                'stock' => 110,
            ],
            [
                'category_name' => 'Musik & Audio',
                'name' => 'Speaker Bluetooth Portabel',
                'description' => 'Speaker portabel dengan suara yang jernih dan bass yang mengejutkan untuk ukurannya. Tahan air dengan rating IPX7, cocok untuk dibawa ke pantai atau kolam renang. Daya tahan baterai hingga 12 jam pemutaran musik.',
                'price' => 650000,
                'stock' => 180,
            ],
        ];

        foreach ($productsData as $productData) {
            if (isset($categories[$productData['category_name']])) {
                $slug = Str::slug($productData['name']);
                if (Product::where('slug', $slug)->exists()) {
                    $slug = $slug . '-' . uniqid();
                }

                Product::create([
                    'category_id' => $categories[$productData['category_name']],
                    'name'        => $productData['name'],
                    'slug'        => $slug,
                    'description' => $productData['description'],
                    'price'       => $productData['price'],
                    'stock'       => $productData['stock'],
                    'is_active'   => true,
                ]);
            }
        }
    }
}