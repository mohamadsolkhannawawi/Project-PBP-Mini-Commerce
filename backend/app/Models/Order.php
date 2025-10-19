<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'order_number',
        'total',
        'status',
        'address_text',
    ];

    // Items included in this order
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Customer who placed this order
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

// backend\app\Models\Order.php