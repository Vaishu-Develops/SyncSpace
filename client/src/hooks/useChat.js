import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import io from 'socket.io-client';

// Get socket URL from the same base as API
const getSocketUrl = () => {
    const apiUrl = api.defaults.baseURL || (import.meta.env.PROD ? 'https://syncspace-fbys.onrender.com' : 'http://localhost:5000');
    return apiUrl;
};

export const useChat = (workspaceId, projectId = null) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typing, setTyping] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        // Initialize socket connection with better configuration
        socketRef.current = io(getSocketUrl(), {
            transports: ['polling', 'websocket'],
            upgrade: true,
            rememberUpgrade: false,
            timeout: 20000,
            forceNew: true
        });

        // Connection event handlers
        socketRef.current.on('connect', () => {
            console.log('Chat socket connected');
            const room = projectId || workspaceId;
            socketRef.current.emit('join-workspace', room);
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('Chat socket connection error:', error);
        });

        socketRef.current.on('disconnect', (reason) => {
            console.log('Chat socket disconnected:', reason);
        });

        // Join room
        const room = projectId || workspaceId;
        socketRef.current.emit('join-workspace', room);

        // Listen for new messages
        socketRef.current.on('message-received', (message) => {
            setMessages(prev => [...prev, message]);
        });

        // Listen for message updates
        socketRef.current.on('message-updated', (message) => {
            setMessages(prev => prev.map(m =>
                m._id === message._id ? message : m
            ));
        });

        // Listen for message deletions
        socketRef.current.on('message-deleted', ({ messageId }) => {
            setMessages(prev => prev.filter(m => m._id !== messageId));
        });

        // Listen for typing indicators
        socketRef.current.on('user-typing', ({ userId, userName }) => {
            setTyping(prev => {
                if (!prev.find(u => u.userId === userId)) {
                    return [...prev, { userId, userName }];
                }
                return prev;
            });
        });

        socketRef.current.on('user-stopped-typing', ({ userId }) => {
            setTyping(prev => prev.filter(u => u.userId !== userId));
        });

        // Fetch initial messages
        fetchMessages();

        return () => {
            socketRef.current.disconnect();
        };
    }, [workspaceId, projectId]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const params = projectId ? { projectId } : { workspaceId };

            const { data } = await api.get('/api/messages', {
                params
            });

            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (content, attachments = []) => {
        try {
            await api.post('/api/messages', {
                content,
                workspaceId,
                projectId,
                attachments
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const deleteMessage = async (messageId) => {
        try {
            await api.delete(`/api/messages/${messageId}`);
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const emitTyping = () => {
        const room = projectId || workspaceId;
        socketRef.current.emit('typing-start', { room });
    };

    const emitStopTyping = () => {
        const room = projectId || workspaceId;
        socketRef.current.emit('typing-stop', { room });
    };

    return {
        messages,
        loading,
        typing,
        sendMessage,
        deleteMessage,
        emitTyping,
        emitStopTyping,
        refetch: fetchMessages
    };
};
