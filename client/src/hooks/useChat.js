import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

export const useChat = (workspaceId, projectId = null) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typing, setTyping] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io('http://localhost:5000');

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
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const params = projectId ? { projectId } : { workspaceId };

            const { data } = await axios.get('http://localhost:5000/api/messages', {
                params,
                headers: { Authorization: `Bearer ${token}` }
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
            const token = JSON.parse(localStorage.getItem('userInfo')).token;

            await axios.post('http://localhost:5000/api/messages', {
                content,
                workspaceId,
                projectId,
                attachments
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const deleteMessage = async (messageId) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;

            await axios.delete(`http://localhost:5000/api/messages/${messageId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
