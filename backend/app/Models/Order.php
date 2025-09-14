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

    /**
     * Mendefinisikan relasi "one-to-many" ke OrderItem.
     * Sebuah pesanan (Order) bisa memiliki banyak item (items).
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Mendefinisikan relasi "belongs-to" ke User.
     * Setiap pesanan (Order) dimiliki oleh satu pengguna (User).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}