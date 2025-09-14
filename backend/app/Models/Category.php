<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
    ];

    /**
     * Mendefinisikan relasi "one-to-many" ke Product.
     * Satu kategori (Category) bisa memiliki banyak produk (products).
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}