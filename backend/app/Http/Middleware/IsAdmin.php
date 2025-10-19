<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

// Middleware to restrict access to admin-only routes
class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    // Only allow requests from users with role 'admin'
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Forbidden. Admin only.'
            ], Response::HTTP_FORBIDDEN);
        }
        return $next($request);
    }
}

// backend\app\Http\Middleware\IsAdmin.php
