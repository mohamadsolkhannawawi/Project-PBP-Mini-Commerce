<?php

namespace App\Providers;

use Illuminate\Support\Facades\App;
use Illuminate\Support\ServiceProvider;

// Main service provider for app-wide bootstrapping
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void // register custom services here
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void // boot custom logic here
    {
        // 
    }
}

// backend\app\Providers\AppServiceProvider.php