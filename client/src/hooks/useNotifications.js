import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import io from 'socket.io-client';

// Get socket URL from the same base as API
const getSocketUrl = () => {
    const apiUrl = api.defaults.baseURL || (import.meta.env.PROD ? 'https://syncspace-fbys.onrender.com' : 'http://localhost:5000');
    return apiUrl;
};

const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(getSocketUrl(), {
            transports: ['polling', 'websocket'],
            upgrade: true,
            rememberUpgrade: false,
            timeout: 20000,
            forceNew: true
        });
        setSocket(newSocket);

        // Connection event handlers
        newSocket.on('connect', () => {
            console.log('Notifications socket connected');
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo) {
                newSocket.emit('user-online', userInfo._id);
            }
        });

        newSocket.on('connect_error', (error) => {
            console.error('Notifications socket connection error:', error);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('Notifications socket disconnected:', reason);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    const fetchNotifications = useCallback(async () => {
        try {
            const { data } = await api.get('/api/notifications');
            setNotifications(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        if (!socket) return;

        socket.on('notification', (newNotification) => {
            setNotifications(prev => [newNotification, ...prev]);
            // Optional: Play sound or show toast
        });

        return () => {
            socket.off('notification');
        };
    }, [socket]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/api/notifications/${id}/read`);

            if (id === 'all') {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            } else {
                setNotifications(prev => prev.map(n =>
                    n._id === id ? { ...n, read: true } : n
                ));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/api/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return {
        notifications,
        loading,
        unreadCount,
        markAsRead,
        deleteNotification,
        refetch: fetchNotifications
    };
};

export default useNotifications;
