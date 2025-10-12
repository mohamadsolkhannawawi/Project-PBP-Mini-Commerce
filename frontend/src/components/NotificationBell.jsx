import React, { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell({ pollInterval = 15000 }) {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const pollRef = useRef(null);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const res = await axiosClient.get('/notifications');
            console.log('Notifications response:', res.data);
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

    useEffect(() => {
        const onDocClick = (e) => {
            if (!open) return;
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target)
            ) {
                setOpen(false);
                cleanupNotifications();
            }
        };

        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [open, notifications]);

    const markRead = async (id) => {
        try {
            await axiosClient.post(`/notifications/${id}/read`);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );

            try {
                await axiosClient.delete(`/notifications/${id}`);
                setNotifications((prev) => prev.filter((n) => n.id !== id));
            } catch (delErr) {
                console.warn(
                    'Failed to delete notification after mark:',
                    delErr
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

    const cleanupNotifications = async () => {
        const now = Date.now();
        const toDelete = notifications
            .filter((n) => {
                if (n.read) return true;
                if (!n.created_at) return false;
                const created = new Date(n.created_at).getTime();
                return now - created > 24 * 60 * 60 * 1000;
            })
            .map((n) => n.id);

        if (toDelete.length === 0) return;

        await Promise.all(
            toDelete.map(async (id) => {
                try {
                    await axiosClient.delete(`/notifications/${id}`);
                } catch (err) {
                }
            })
        );

        setNotifications((prev) =>
            prev.filter((n) => !toDelete.includes(n.id))
        );
    };

    const unreadCount = notifications.filter((n) => !n.read).length;
    const visibleNotifications = notifications.filter((n) => !n.read);

    console.log('Notifications debug:', {
        total: notifications.length,
        unread: unreadCount,
        visible: visibleNotifications.length,
        notifications: notifications,
    });

    return (
        <div className="relative" ref={containerRef}>
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
                                    const ids = notifications.map((n) => n.id);
                                    await Promise.all(
                                        ids.map(async (id) => {
                                            try {
                                                await axiosClient.delete(
                                                    `/notifications/${id}`
                                                );
                                            } catch (_) {}
                                        })
                                    );
                                    setNotifications([]);
                                } catch (err) {
                                    console.error(err);
                                }
                            }}
                        >
                            Mark all
                        </button>
                    </div>
                    <div className="max-h-64 overflow-auto">
                        {visibleNotifications.length === 0 && (
                            <div className="p-3 text-sm text-gray-500">
                                No notifications
                            </div>
                        )}
                        {visibleNotifications.map((n) => (
                            <div
                                key={n.id}
                                className={`p-3 border-b bg-gray-50`}
                            >
                                <div className="flex justify-between">
                                    <div
                                        className="text-sm cursor-pointer hover:text-blue-600"
                                        onClick={async () => {
                                            try {
                                                await axiosClient.post(
                                                    `/notifications/${n.id}/read`
                                                );
                                                try {
                                                    await axiosClient.delete(
                                                        `/notifications/${n.id}`
                                                    );
                                                } catch (_) {}
                                                setNotifications((prev) =>
                                                    prev.filter(
                                                        (x) => x.id !== n.id
                                                    )
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
                                    <button
                                        className="text-xs text-blue-600"
                                        onClick={() => markRead(n.id)}
                                    >
                                        Mark
                                    </button>
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