<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductImage extends Model
{
    use HasFactory;

    // Tabel ini tidak memerlukan timestamps created_at dan updated_at
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'image_url',
        'alt_text',
        'sort_order',
    ];

    /**
     * Mendefinisikan relasi "belongs-to" kembali ke Product.
     * Setiap gambar (ProductImage) dimiliki oleh satu Produk (Product).
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
