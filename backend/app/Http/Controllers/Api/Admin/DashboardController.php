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
        $totalRevenue = Order::where('status', 'selesai')->sum('total');
        $totalOrders = Order::count();
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
