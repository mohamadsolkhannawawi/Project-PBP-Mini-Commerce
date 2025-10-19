<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'product_id', 'order_item_id', 'rating', 'comment'];

    // Reviewer (customer)
    public function user() { return $this->belongsTo(User::class); }
    // Reviewed product
    public function product() { return $this->belongsTo(Product::class); }
    // Related purchased item
    public function orderItem() { return $this->belongsTo(OrderItem::class); }
}

// backend\app\Models\Review.php
