<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'image_url',
        'is_active',
    ];

    /**
     * Mendefinisikan relasi "belongs-to" ke Category.
     * Setiap produk (Product) dimiliki oleh satu kategori (Category).
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Mendefinisikan relasi "one-to-many" ke ProductImage.
     * Satu produk (Product) bisa memiliki banyak gambar (images).
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }
}
