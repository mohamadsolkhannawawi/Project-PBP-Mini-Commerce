<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon; // For date and time manipulation

class DashboardController extends Controller
{
    // Return KPI metrics and small datasets for admin dashboard
    public function index()
    {
        $totalRevenue = Order::where('status', 'selesai')->sum('total'); // total revenue from completed orders
        $totalOrders = Order::count(); // total number of orders

        // total items sold from completed orders
        $totalSold = \DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'selesai')
            ->sum('order_items.quantity');
        $totalProducts = Product::count(); // total number of products
        $totalCustomers = User::where('role', 'user')->count(); // total number of customers

        // eager load user relationship to avoid N+1 problem
        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get();

        // sales over the past 7 days
        $salesOverTime = Order::select(
                DB::raw('DATE(created_at) as date'), // raw expression to extract date
                DB::raw('SUM(total) as revenue') // raw expression to sum total revenue
            )
            ->where('status', 'selesai')
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();

    // top 5 best-selling products
        $topSellingProducts = Product::withCount(['orderItems as items_sold' => function ($query) { // custom count for items sold
                $query->select(DB::raw('sum(quantity)'));
            }])
            ->orderByDesc('items_sold')
            ->take(5)
            ->get();

        // return the compiled dashboard data as JSON response
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

// backend\app\Http\Controllers\Api\Admin\DashboardController.php