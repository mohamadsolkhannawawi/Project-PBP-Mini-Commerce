<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import semua controller yang akan kita gunakan
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Rute Publik (tidak perlu login)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product:slug}', [ProductController::class, 'show']);

// Rute yang membutuhkan otentikasi (pengguna harus login)
Route::middleware('auth:sanctum')->group(function () {
    // Rute untuk mengambil data user yang sedang login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Rute untuk Keranjang Belanja
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart-items/{cartItem}', [CartController::class, 'update']);
    Route::delete('/cart-items/{cartItem}', [CartController::class, 'destroy']);
    

    // Rute untuk Checkout
    Route::post('/checkout', [OrderController::class, 'store']);
});

// Rute Khusus Admin (membutuhkan login & peran 'admin')
Route::middleware(['auth:sanctum', 'is.admin'])->prefix('admin')->group(function () {
    Route::apiResource('/products', AdminProductController::class);
    Route::get('/orders', [AdminOrderController::class, 'index']);
    
    // PERBAIKAN: Mengembalikan ke Route::put yang benar secara semantik.
    // Ini akan bekerja setelah cache dibersihkan dan Postman disesuaikan.
    Route::put('/orders/{order}', [AdminOrderController::class, 'update']);
});

