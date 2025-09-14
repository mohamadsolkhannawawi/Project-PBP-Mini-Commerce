<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;
    
    /**
     * Menunjukkan bahwa model ini tidak menggunakan timestamps (created_at & updated_at).
     * Sesuaikan dengan file migrasi Anda. Jika migrasi Anda punya timestamps, hapus baris ini.
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_id',
        'product_id',
        'product_name',
        'price',
        'quantity',
        'subtotal',
    ];

    /**
     * Mendefinisikan relasi "belongs-to" ke Product.
     * Setiap item pesanan (OrderItem) merujuk ke satu Produk (Product).
     * INI ADALAH PERBAIKANNYA.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}

