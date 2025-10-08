import React, { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell({ pollInterval = 15000 }) {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const pollRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const res = await axiosClient.get('/notifications');
            setNotifications(res.data.notifications || []);
        } catch (err) {
            console.error('notif fetch', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        pollRef.current = setInterval(fetchNotifications, pollInterval);
        return () => clearInterval(pollRef.current);
    }, [pollInterval]);

    const markRead = async (id) => {
        try {
            await axiosClient.post(`/notifications/${id}/read`);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
        } catch (err) {
            console.error(err);
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <div className="relative">
            <button
                onClick={() => {
                    setOpen(!open);
                    if (!open) fetchNotifications();
                }}
                className="relative p-2 rounded-full hover:bg-gray-100"
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6 text-[#1B263B]" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow z-50">
                    <div className="p-3 border-b flex justify-between items-center">
                        <div className="font-semibold">Notifications</div>
                        <button
                            className="text-sm text-blue-600"
                            onClick={async () => {
                                try {
                                    await axiosClient.post(
                                        '/notifications/mark-all-read'
                                    );
                                    setNotifications((prev) =>
                                        prev.map((n) => ({ ...n, read: true }))
                                    );
                                } catch (err) {
                                    console.error(err);
                                }
                            }}
                        >
                            Mark all
                        </button>
                    </div>
                    <div className="max-h-64 overflow-auto">
                        {notifications.length === 0 && (
                            <div className="p-3 text-sm text-gray-500">
                                No notifications
                            </div>
                        )}
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`p-3 border-b ${
                                    n.read ? '' : 'bg-gray-50'
                                }`}
                            >
                                <div className="flex justify-between">
                                    <div
                                        className="text-sm cursor-pointer"
                                        onClick={async () => {
                                            // Always navigate to admin orders list when notification clicked
                                            try {
                                                // mark as read on click
                                                await axiosClient.post(
                                                    `/notifications/${n.id}/read`
                                                );
                                            } catch (err) {
                                                console.error(
                                                    'mark read failed',
                                                    err
                                                );
                                            }
                                            setOpen(false);
                                            navigate('/admin/orders');
                                        }}
                                    >
                                        {n.title}
                                    </div>
                                    {!n.read && (
                                        <button
                                            className="text-xs text-blue-600"
                                            onClick={() => markRead(n.id)}
                                        >
                                            Mark
                                        </button>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {n.body}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
