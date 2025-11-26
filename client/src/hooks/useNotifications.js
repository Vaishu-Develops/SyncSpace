import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            newSocket.emit('user-online', userInfo._id);
        }

        return () => newSocket.close();
    }, []);

    const fetchNotifications = useCallback(async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const { data } = await axios.get('http://localhost:5000/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
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
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

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
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
