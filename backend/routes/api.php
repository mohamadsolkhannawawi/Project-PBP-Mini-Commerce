<?php

use App\Http\Controllers\Api\ReviewController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product:slug}', [ProductController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart-items/{cartItem}', [CartController::class, 'update']);
    Route::delete('/cart-items/{cartItem}', [CartController::class, 'destroy']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::post('/checkout', [OrderController::class, 'store']);
});

Route::middleware(['auth:sanctum', 'is.admin'])->prefix('admin')->group(function () {
    Route::apiResource('/products', AdminProductController::class)->except(['update']);
    Route::post('/products/{product}', [AdminProductController::class, 'update'])->name('products.update.post');
    Route::patch('/products/{product}/toggle-status', [AdminProductController::class, 'toggleStatus']);
    Route::get('/orders', [AdminOrderController::class, 'index']);
    Route::get('/debug/categories', [ProductController::class, 'debugCategories'])->middleware('auth:sanctum');
    
    Route::put('/orders/{order}', [AdminOrderController::class, 'update']);
    Route::get('/dashboard', [DashboardController::class, 'index']);
});

