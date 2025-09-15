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
     * Properti ini adalah "daftar putih" kolom yang boleh diisi
     * menggunakan metode create() atau update().
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
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Mendefinisikan relasi "one-to-many" ke ProductImage.
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }
}