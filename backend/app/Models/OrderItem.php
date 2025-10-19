<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;
    
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

    // Product reference for this line item
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // Parent order of this line item
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    // Optional review tied to this purchased item
    public function review() { return $this->hasOne(Review::class); }
}

// backend\app\Models\OrderItem.php

