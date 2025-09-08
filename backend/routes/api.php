<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;

/*
|--------------------------------------------------------------------------
| Rute Publik (Tidak Memerlukan Login)
|--------------------------------------------------------------------------
|
| Rute-rute ini dapat diakses oleh siapa saja, termasuk pengunjung.
|
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);


/*
|--------------------------------------------------------------------------
| Rute Terotentikasi (Wajib Login)
|--------------------------------------------------------------------------
|
| Semua rute di dalam grup ini dilindungi oleh Sanctum.
| Pengguna harus mengirimkan token API yang valid untuk mengaksesnya.
|
*/
Route::middleware('auth:sanctum')->group(function () {
    // Rute untuk mendapatkan data pengguna yang sedang login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Rute untuk Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // ... Nanti, rute untuk Keranjang, Checkout, dan Admin akan ditambahkan di sini ...
    Route::apiResource('/cart', CartController::class)->except(['show']);
Route::post('/checkout', [OrderController::class, 'store']);
});
