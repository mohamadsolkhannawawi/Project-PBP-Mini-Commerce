<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();
        if ($products->isEmpty()) {
            // nothing to seed against
            return;
        }

        $users = User::where('role', 'user')->get();

        foreach ($users as $i => $user) {
            // Each user will have 1-3 orders
            $orderCount = rand(1, 3);
            for ($o = 0; $o < $orderCount; $o++) {
                DB::transaction(function () use ($user, $products, $o, $orderCount) {
                    $selected = $products->random(rand(1, 4));

                    // Ensure at least one completed order per user:
                    // if this is the last iteration and no completed order was created yet,
                    // force this one to 'selesai'. We approximate by preferring 'selesai'
                    // with 70% chance, but guarantee on the last loop.
                    static $createdCompleted = [];
                    $userKey = $user->id;

                    $hasCompletedForUser = isset($createdCompleted[$userKey]) && $createdCompleted[$userKey] === true;

                    if ($hasCompletedForUser) {
                        $status = (rand(1, 100) <= 70) ? 'selesai' : 'pending';
                    } else {
                        // if last iteration, force selesai; otherwise prefer selesai with 70% chance
                        if ($o === ($orderCount - 1)) {
                            $status = 'selesai';
                        } else {
                            $status = (rand(1, 100) <= 70) ? 'selesai' : 'pending';
                        }
                    }

                    if ($status === 'selesai') {
                        $createdCompleted[$userKey] = true;
                    }

                    $order = Order::create([
                        'user_id' => $user->id,
                        'order_number' => 'ORD-' . Str::upper(Str::random(8)),
                        'total' => 0, // will update after items
                        'status' => $status,
                        'address_text' => 'Jl. Contoh Alamat No ' . rand(1, 200),
                    ]);

                    $total = 0;

                    foreach ($selected as $prod) {
                        $qty = rand(1, 3);
                        $subtotal = $prod->price * $qty;

                        OrderItem::create([
                            'order_id' => $order->id,
                            'product_id' => $prod->id,
                            'product_name' => $prod->name,
                            'price' => $prod->price,
                            'quantity' => $qty,
                            'subtotal' => $subtotal,
                        ]);

                        $total += $subtotal;
                    }

                    $order->total = $total;
                    $order->save();
                });
            }
        }
    }
}
