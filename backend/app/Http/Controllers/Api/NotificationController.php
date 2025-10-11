<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['notifications' => []]);

        $notifications = $user->notifications()->latest()->get()->map(function ($n) {
            return [
                'id' => $n->id,
                'read' => $n->read_at !== null,
                'title' => $n->data['title'] ?? null,
                'body' => $n->data['body'] ?? null,
                'data' => $n->data,
                'created_at' => $n->created_at,
            ];
        })->toArray();

        return response()->json(['notifications' => $notifications]);
    }

    public function markRead(Request $request, $id)
    {
        $user = $request->user();
        $notification = $user->notifications()->where('id', $id)->first();
        if (!$notification) return response()->json(['message' => 'Notification not found'], 404);
        $notification->markAsRead();
        return response()->json(['success' => true]);
    }

    public function markAllRead(Request $request)
    {
        $user = $request->user();
        $user->unreadNotifications()->update(['read_at' => now()]);
        return response()->json(['success' => true]);
    }

    public function delete(Request $request, $id)
    {
        $user = $request->user();
        $notification = $user->notifications()->where('id', $id)->first();
        if (!$notification) return response()->json(['message' => 'Notification not found'], 404);
        $notification->delete();
        return response()->json(['success' => true]);
    }
}
