<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // KPI Cards
        // Only include completed orders in revenue (status = 'selesai')
        $totalRevenue = Order::where('status', 'selesai')->sum('total');
        $totalOrders = Order::count();
        // Total units sold across completed orders
        $totalSold = \DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'selesai')
            ->sum('order_items.quantity');
        $totalProducts = Product::count();
        $totalCustomers = User::where('role', 'user')->count();

        // Recent Orders
        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get();

        // Sales Chart Data (last 7 days)
        $salesOverTime = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total) as revenue')
            )
            ->where('status', 'selesai')
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();

        // Top Selling Products
        $topSellingProducts = Product::withCount(['orderItems as items_sold' => function ($query) {
                $query->select(DB::raw('sum(quantity)'));
            }])
            ->orderByDesc('items_sold')
            ->take(5)
            ->get();

        return response()->json([
            'kpi' => [
                'totalRevenue' => $totalRevenue,
                'sold' => (int) $totalSold,
                'totalOrders' => $totalOrders,
                'totalProducts' => $totalProducts,
                'totalCustomers' => $totalCustomers,
            ],
            'recentOrders' => $recentOrders,
            'salesOverTime' => $salesOverTime,
            'topSellingProducts' => $topSellingProducts,
        ]);
    }
}
