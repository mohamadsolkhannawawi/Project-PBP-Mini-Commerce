# Dokumentasi Frontend UMKM-MiniCommerce

Dokumen ini menjelaskan struktur folder dan file dari aplikasi frontend UMKM-MiniCommerce. Aplikasi ini dibangun menggunakan React dan Vite.

## Struktur Folder Utama

Berikut adalah struktur folder utama di dalam direktori `frontend/src`:

```
src/
├── api/
├── assets/
├── components/
├── contexts/
├── data/
├── layouts/
├── pages/
├── App.css
├── App.jsx
├── index.css
└── main.jsx
```

---

## Penjelasan Detail

### File Utama (Root)

File-file ini berada di level atas direktori `src` dan menjadi inti dari aplikasi.

-   **`main.jsx`**

    -   **Fungsi**: Titik masuk (entry point) utama aplikasi.
    -   **Isi Kode**: Menggunakan `ReactDOM.createRoot()` untuk me-render komponen utama (`App`) ke dalam elemen `#root` di `index.html`. Ini adalah file pertama yang dieksekusi.

-   **`App.jsx`**

    -   **Fungsi**: Komponen root yang mengatur semua routing aplikasi.
    -   **Isi Kode**: Menggunakan `react-router-dom` untuk mendefinisikan semua rute (URL) aplikasi. Komponen ini membungkus semua halaman dengan `AuthProvider` dan `CartProvider` untuk manajemen state otentikasi dan keranjang belanja.

-   **`index.css`**

    -   **Fungsi**: Menyimpan style global.
    -   **Isi Kode**: Berisi style CSS yang berlaku untuk seluruh aplikasi, seperti style untuk `body`, `html`, dan konfigurasi dasar Tailwind CSS.

-   **`App.css`**
    -   **Fungsi**: Menyimpan style spesifik untuk komponen `App.jsx`.
    -   **Isi Kode**: Berisi style CSS yang hanya digunakan oleh komponen `App.jsx`.

---

### Folder `api`

Folder ini berisi logika untuk berkomunikasi dengan backend.

-   **`axiosClient.js`**
    -   **Fungsi**: Konfigurasi instance Axios.
    -   **Isi Kode**: Membuat dan mengkonfigurasi instance Axios terpusat dengan `baseURL` dan interceptor. Ini digunakan untuk membuat semua permintaan HTTP ke API backend, menyederhanakan penanganan token otentikasi dan error.

---

### Folder `assets`

Folder ini berisi semua aset statis.

-   **`react.svg`**
    -   **Fungsi**: Aset gambar.
    -   **Isi Kode**: File gambar SVG, dalam kasus ini logo React.

---

### Folder `components`

Folder ini berisi komponen-komponen UI yang dapat digunakan kembali di berbagai halaman.

-   **`CartItem.jsx`**: Komponen untuk menampilkan satu item di dalam keranjang belanja.
-   **`CartModal.jsx`**: Komponen modal yang muncul untuk menampilkan ringkasan keranjang.
-   **`Footer.jsx`**: Komponen footer aplikasi.
-   **`Navbar.jsx`**: Komponen navigasi utama aplikasi.
-   **`ProductCard.jsx`**: Komponen kartu untuk menampilkan ringkasan satu produk di halaman daftar produk.
-   **`ProductList.jsx`**: Komponen yang menampung dan menampilkan daftar `ProductCard`.
-   **`SearchBar.jsx`**: Komponen untuk fitur pencarian produk.
-   **`ProtectedRoute.jsx`**: Komponen HOC (Higher-Order Component) untuk melindungi rute yang memerlukan otentikasi (umum).
-   **`UserProtectedRoute.jsx`**: Komponen HOC yang spesifik untuk melindungi rute pengguna biasa.
-   **`admin/`**: Subfolder untuk komponen yang hanya digunakan di dasbor admin.
    -   **`AdminSidebar.jsx`**: Komponen sidebar navigasi untuk admin.
    -   **`OrdersTable.jsx`**: Komponen tabel untuk menampilkan daftar pesanan.
    -   **`ProductForm.jsx`**: Form untuk menambah atau mengedit produk.

---

### Folder `contexts`

Folder ini berisi React Context untuk manajemen state global.

-   **`AuthContext.jsx`**

    -   **Fungsi**: Mengelola state otentikasi pengguna.
    -   **Isi Kode**: Menyediakan state seperti `user`, `token`, dan fungsi-fungsi seperti `login`, `logout`, `register` ke seluruh aplikasi.

-   **`CartContext.jsx`**
    -   **Fungsi**: Mengelola state keranjang belanja.
    -   **Isi Kode**: Menyediakan state seperti `cartItems` dan fungsi-fungsi seperti `addToCart`, `removeFromCart`, `clearCart`.

---

### Folder `data`

Folder ini digunakan untuk menyimpan data statis atau mock.

-   **`mockData.js`**
    -   **Fungsi**: Menyediakan data palsu untuk pengembangan.
    -   **Isi Kode**: Berisi array objek yang meniru data produk, kategori, atau data lain yang seharusnya berasal dari API.

---

### Folder `layouts`

Folder ini berisi komponen layout yang membungkus halaman-halaman.

-   **`MainLayout.jsx`**

    -   **Fungsi**: Layout utama untuk pengguna umum.
    -   **Isi Kode**: Biasanya terdiri dari `Navbar`, `Footer`, dan konten halaman (`<Outlet />` dari React Router). Semua halaman non-admin akan menggunakan layout ini.

-   **`AdminLayout.jsx`**
    -   **Fungsi**: Layout untuk dasbor admin.
    -   **Isi Kode**: Terdiri dari `AdminSidebar` dan konten halaman admin (`<Outlet />`). Rute di bawah `/admin` akan menggunakan layout ini.

---

### Folder `pages`

Folder ini berisi komponen yang mewakili satu halaman penuh dari aplikasi.

-   **`HomePage.jsx`**: Halaman utama/beranda.
-   **`ProductDetailPage.jsx`**: Halaman untuk menampilkan detail satu produk.
-   **`LoginPage.jsx`**: Halaman untuk login pengguna.
-   **`RegisterPage.jsx`**: Halaman untuk registrasi pengguna baru.
-   **`CartPage.jsx`**: Halaman keranjang belanja.
-   **`CheckoutPage.jsx`**: Halaman untuk proses checkout.
-   **`SearchResultsPage.jsx`**: Halaman untuk menampilkan hasil pencarian.
-   **`admin/`**: Subfolder untuk halaman-halaman dasbor admin.
    -   **`AdminDashboardPage.jsx`**: Halaman utama dasbor admin (kemungkinan besar tidak terpakai karena ada redirect).
    -   **`ManageOrdersPage.jsx`**: Halaman untuk mengelola pesanan.
    -   **`ManageProductsPage.jsx`**: Halaman untuk mengelola produk.
