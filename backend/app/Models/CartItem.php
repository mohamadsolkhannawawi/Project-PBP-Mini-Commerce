<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    use HasFactory;

    // Tidak menggunakan timestamps default (created_at, updated_at)
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     * Ini sangat penting untuk metode create() di controller.
     * @var array<int, string>
     */
    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
    ];

    /**
     * Mendefinisikan relasi "belongs-to" ke Product.
     * Setiap item keranjang (CartItem) merujuk ke satu Produk (Product).
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Mendefinisikan relasi "belongs-to" ke Cart.
     */
    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }
}
