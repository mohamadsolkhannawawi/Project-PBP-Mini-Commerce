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
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Rute Publik (tidak perlu login)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product:slug}', [ProductController::class, 'show']); // Menggunakan slug untuk SEO-friendly URL

// Rute yang membutuhkan otentikasi (pengguna harus login)
Route::middleware('auth:sanctum')->group(function () {
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
    Route::put('/orders/{order}', [AdminOrderController::class, 'update']);
});
