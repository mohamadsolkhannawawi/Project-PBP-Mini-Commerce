<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        // Asumsikan ada field 'role' pada tabel users, dan admin = 'admin'
        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Forbidden. Admin only.'
            ], Response::HTTP_FORBIDDEN);
        }
        return $next($request);
    }
}
