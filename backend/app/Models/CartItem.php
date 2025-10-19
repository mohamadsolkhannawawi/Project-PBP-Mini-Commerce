<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    use HasFactory;

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

    // Product for this cart line
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // Owning cart
    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }
}

// backend\app\Models\CartItem.php
