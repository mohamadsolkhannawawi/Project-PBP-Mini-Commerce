# Dokumentasi Backend UMKM-MiniCommerce (Laravel)

Dokumen ini menjelaskan struktur folder dan file dari aplikasi backend yang dibangun menggunakan framework Laravel. Memahami struktur ini penting untuk pengembangan dan pemeliharaan.

## Struktur Folder Utama

Berikut adalah direktori-direktori utama dalam aplikasi Laravel dan fungsinya:

```
/
├── app/                 # Folder inti aplikasi (logika bisnis)
├── bootstrap/           # Script untuk bootstraping aplikasi
├── config/              # File-file konfigurasi
├── database/            # Migrasi, seeder, dan factory database
├── public/              # Document root, titik masuk aplikasi
├── resources/           # View, aset mentah (CSS, JS), file bahasa
├── routes/              # Definisi rute aplikasi
├── storage/             # File cache, log, dan file yang di-upload
├── tests/               # File-file pengujian (Unit & Feature)
├── vendor/              # Dependensi dari Composer
├── .env                 # Konfigurasi spesifik untuk environment
├── artisan              # Command-line interface (CLI) Laravel
└── composer.json        # Definisi dependensi proyek
```

---

## Penjelasan Detail

### Folder `app`

Ini adalah folder utama yang berisi semua logika bisnis aplikasi Anda.

-   **`Http/`**: Berisi `Controllers`, `Middleware`, dan `Requests`. Semua logika yang menangani permintaan HTTP masuk ke sini.
-   **`Models/`**: Berisi semua kelas Model Eloquent. Setiap model merepresentasikan satu tabel di database dan digunakan untuk berinteraksi dengan tabel tersebut.
-   **`Providers/`**: Berisi semua Service Provider. Ini adalah tempat untuk me-bootstrap layanan, event listener, dll.
-   **`Exceptions/`**: Berisi handler untuk semua eksepsi yang terjadi di aplikasi.

### Folder `bootstrap`

Folder ini berisi script untuk memulai (bootstrap) framework Laravel.

-   **`app.php`**: File utama yang membuat instance dari aplikasi.
-   **`cache/`**: Berisi file-file cache yang digenerate oleh framework untuk meningkatkan performa, seperti `packages.php` dan `services.php`.

### Folder `config`

Berisi semua file konfigurasi aplikasi, seperti koneksi database (`database.php`), konfigurasi aplikasi (`app.php`), email (`mail.php`), dll. Nilai di sini dapat di-override oleh file `.env`.

### Folder `database`

Semua yang berhubungan dengan skema dan data database Anda ada di sini.

-   **`factories/`**: Digunakan untuk mendefinisikan cara membuat data palsu (fake data) untuk model Anda. Sangat berguna untuk testing dan seeding.
-   **`migrations/`**: Berisi file-file migrasi untuk mengelola skema database Anda secara version-controlled. Setiap file mendefinisikan perubahan pada struktur database.
-   **`seeders/`**: Berisi kelas-kelas untuk mengisi database dengan data awal (seeding).

### Folder `public`

Ini adalah _document root_ untuk aplikasi Anda. Semua permintaan masuk melalui folder ini.

-   **`index.php`**: Titik masuk (entry point) untuk semua permintaan HTTP.
-   **Aset yang sudah di-compile**: Seperti file CSS dan JavaScript yang sudah diproses.

### Folder `resources`

Berisi file-file mentah yang akan di-compile atau digunakan untuk view.

-   **`css/`**, **`js/`**: Berisi file mentah CSS (seperti Tailwind) dan JavaScript sebelum di-compile.
-   **`views/`**: Berisi semua template Blade untuk aplikasi Anda.
-   **`lang/`** (jika ada): Berisi file-file bahasa untuk lokalisasi.

### Folder `routes`

Tempat untuk mendefinisikan semua rute (URL) aplikasi.

-   **`web.php`**: Untuk rute web yang menggunakan state seperti session dan CSRF protection.
-   **`api.php`**: Untuk rute API yang bersifat stateless.
-   **`console.php`**: Untuk mendefinisikan command Artisan kustom Anda.

### Folder `storage`

Folder ini digunakan oleh framework untuk menyimpan file yang digenerate, cache, log, dll.

-   **`app/public/`**: Direktori ini digunakan untuk menyimpan file yang di-generate oleh pengguna (seperti avatar) yang harus dapat diakses secara publik. Anda perlu menjalankan `php artisan storage:link` untuk membuatnya dapat diakses dari web.
-   **`framework/`**: Berisi file-file yang digenerate oleh framework seperti cache, session, dan view yang sudah di-compile.
-   **`logs/`**: Berisi file log aplikasi, seperti `laravel.log`.

### Folder `tests`

Berisi semua file pengujian otomatis Anda.

-   **`Feature/`**: Untuk pengujian fungsional yang menguji sebagian besar fungsionalitas aplikasi dari luar (misalnya, melalui request HTTP).
-   **`Unit/`**: Untuk pengujian unit yang menguji bagian kecil dan terisolasi dari kode Anda.

### File Penting di Root

-   **`.env`**: File yang sangat penting ini berisi konfigurasi spesifik untuk environment tempat aplikasi berjalan (lokal, staging, produksi). File ini **tidak boleh** dimasukkan ke dalam version control.
-   **`.env.example`**: File contoh yang menunjukkan variabel apa saja yang dibutuhkan oleh aplikasi.
-   **`artisan`**: Script PHP yang menjadi entry point untuk semua command Artisan.
-   **`composer.json`**: File yang mendefinisikan semua dependensi PHP (paket) yang dibutuhkan oleh proyek Anda.
