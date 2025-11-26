import { useState, useRef, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { Avatar } from '../ui';
import axios from 'axios';

const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            if (!token) return;

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const { data } = await axios.get('http://localhost:5000/api/notifications', config);
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id, e) => {
        e.stopPropagation();
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, config);

            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, read: true } : n
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.put('http://localhost:5000/api/notifications/all/read', {}, config);

            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'mention', label: 'Mentions' },
        { id: 'assignment', label: 'Assignments' }
    ];

    const filteredNotifications = activeTab === 'all'
        ? notifications
        : notifications.filter(n => n.type === activeTab);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'mention': return 'bg-primary';
            case 'assignment': return 'bg-secondary';
            case 'system': return 'bg-accent';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors text-gray-400 hover:text-white group"
            >
                <Bell className="h-6 w-6 group-hover:text-primary transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-900">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 glass border border-slate-700 rounded-lg shadow-2xl z-50 animate-slide-down origin-top-right">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/50 rounded-t-lg">
                        <h3 className="text-lg font-semibold text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1"
                            >
                                <Check className="h-3 w-3" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-slate-700 px-2 bg-slate-900/30">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id
                                    ? 'text-primary border-primary'
                                    : 'text-gray-400 border-transparent hover:text-white'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-8 text-center text-gray-400">
                                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                                Loading...
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                                <Bell className="h-12 w-12 text-slate-700 mb-3" />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            filteredNotifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`p-4 border-b border-slate-700 hover:bg-slate-800/50 transition-colors relative group ${!notification.read ? 'bg-primary/5' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${getNotificationColor(notification.type)}`}></div>
                                        <Avatar
                                            name={notification.sender?.name || 'System'}
                                            src={notification.sender?.avatar}
                                            size="sm"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white">
                                                <span className="font-medium">{notification.sender?.name || 'System'}</span>
                                                {' '}
                                                <span className="text-gray-300">{notification.content}</span>
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatTime(notification.createdAt)}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <button
                                                onClick={(e) => markAsRead(notification._id, e)}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700 rounded-full text-primary transition-all"
                                                title="Mark as read"
                                            >
                                                <div className="h-2 w-2 bg-primary rounded-full"></div>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
