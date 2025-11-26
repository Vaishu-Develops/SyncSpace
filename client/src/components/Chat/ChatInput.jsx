import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ onSend, onTyping, onStopTyping }) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    const handleChange = (e) => {
        setMessage(e.target.value);

        // Emit typing indicator
        if (!isTyping) {
            setIsTyping(true);
            onTyping();
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to stop typing
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            onStopTyping();
        }, 1000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (message.trim()) {
            onSend(message.trim());
            setMessage('');
            setIsTyping(false);
            onStopTyping();

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border-t border-slate-700 bg-slate-800/50 p-4">
            <div className="flex items-end gap-2">
                {/* Message Input */}
                <div className="flex-1 relative">
                    <textarea
                        value={message}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        rows="1"
                        style={{ minHeight: '40px', maxHeight: '120px' }}
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                    />
                </div>

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={!message.trim()}
                    className="p-2 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Send message"
                >
                    <Send className="h-5 w-5" />
                </button>
            </div>
        </form>
    );
};

export default ChatInput;
