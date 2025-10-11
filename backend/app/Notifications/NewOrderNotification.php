<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;
use App\Models\Order;

class NewOrderNotification extends Notification
{
    use Queueable;

    protected $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'New Order: ' . $this->order->order_number,
            'body' => 'Order #' . $this->order->order_number . ' placed by ' . ($this->order->user->name ?? 'Guest'),
            // navigate to admin order management list when clicking the notification
            'route' => '/admin/orders',
            'order_id' => $this->order->id,
        ];
    }
}
