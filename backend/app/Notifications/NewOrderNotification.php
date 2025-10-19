<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;
use App\Models\Order;

// Database notification for new order (sent to admins)
class NewOrderNotification extends Notification
{
    use Queueable;

    protected $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    // Only use database channel
    public function via($notifiable)
    {
        return ['database'];
    }

    // Data stored in notifications table
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'New Order: ' . $this->order->order_number,
            'body' => 'Order #' . $this->order->order_number . ' placed by ' . ($this->order->user->name ?? 'Guest'),
            'route' => '/admin/orders',
            'order_id' => $this->order->id,
        ];
    }
}

// backend\app\Notifications\NewOrderNotification.php
