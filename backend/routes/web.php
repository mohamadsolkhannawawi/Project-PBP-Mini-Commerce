<?php

use Illuminate\Support\Facades\Route;

// Main web route (returns welcome view)
Route::get('/', function () {
    return view('welcome');
});

// backend\routes\web.php
