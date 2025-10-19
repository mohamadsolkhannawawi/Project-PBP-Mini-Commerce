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
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = ['sold_count', 'primary_image', 'gallery_images']; // virtual attributes appended to serialization

    // Category this product belongs to
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // Reviews written for this product
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    // All images for this product
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    // Accessor: return the primary image (fallback to first)
    public function getPrimaryImageAttribute()
    {
        $primaryImage = $this->images()->where('is_primary', true)->first();
        if ($primaryImage) {
            return $primaryImage;
        }

        return $this->images()->first();
    }

    // Accessor: return non-primary images as gallery
    public function getGalleryImagesAttribute()
    {
        return $this->images()->where('is_primary', false)->get();
    }

    // Line items referencing this product
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Aggregated sold quantity via order_items
    public function getSoldCountAttribute()
    {
        return $this->orderItems()->sum('quantity');
    }
}

// backend\app\Models\Product.php