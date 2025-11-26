import React from 'react';
import EnhancedSidebar from '../components/Dashboard/EnhancedSidebar';
import { Bell, MessageSquare, CheckSquare, UserPlus, Star, Trash2 } from 'lucide-react';
import useNotifications from '../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPage = () => {
    const { notifications, loading, markAsRead, deleteNotification } = useNotifications();

    const getIcon = (type) => {
        switch (type) {
            case 'mention': return <MessageSquare className="h-4 w-4 text-blue-400" />;
            case 'assignment': return <CheckSquare className="h-4 w-4 text-green-400" />;
            case 'system': return <Star className="h-4 w-4 text-yellow-400" />;
            default: return <Bell className="h-4 w-4 text-gray-400" />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-900 text-white">
            <EnhancedSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-3xl mx-auto">
                        <header className="mb-8 flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Notifications</h1>
                                <p className="text-gray-400">Stay updated with your team's activity</p>
                            </div>
                            <button
                                onClick={() => markAsRead('all')}
                                className="text-sm text-primary hover:text-primary/80 transition-colors"
                            >
                                Mark all as read
                            </button>
                        </header>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
                                <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-300">No notifications</h3>
                                <p className="text-gray-500">You're all caught up!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`p-4 rounded-xl border transition-all hover:border-primary/50 flex gap-4 ${notification.read
                                            ? 'bg-slate-800/50 border-slate-700/50'
                                            : 'bg-slate-800 border-slate-700 shadow-lg shadow-black/20'
                                            }`}
                                    >
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${notification.read ? 'bg-slate-700/50' : 'bg-slate-700'
                                            }`}>
                                            {getIcon(notification.type)}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm text-gray-300">
                                                    <span className="font-semibold text-white">{notification.sender?.name || 'System'}</span>
                                                    {' '}{notification.content}
                                                </p>
                                                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <div className="mt-2 flex gap-2">
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification._id)}
                                                        className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
                                                    >
                                                        Mark as read
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notification._id)}
                                                    className="text-xs bg-slate-700 text-gray-400 px-3 py-1 rounded-full hover:bg-red-500/10 hover:text-red-400 transition-colors flex items-center gap-1"
                                                >
                                                    <Trash2 className="h-3 w-3" /> Remove
                                                </button>
                                            </div>
                                        </div>

                                        {!notification.read && (
                                            <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default NotificationsPage;
