import React, { useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { Loader } from 'lucide-react';

const ChatPanel = ({ workspaceId, projectId = null }) => {
    const messagesEndRef = useRef(null);
    const currentUser = JSON.parse(localStorage.getItem('userInfo'));

    const {
        messages,
        loading,
        typing,
        sendMessage,
        deleteMessage,
        emitTyping,
        emitStopTyping
    } = useChat(workspaceId, projectId);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-900">
                <Loader className="h-8 w-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-slate-900 h-full">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className="text-gray-400 mb-2">No messages yet</p>
                            <p className="text-sm text-gray-500">Start the conversation!</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            <MessageBubble
                                key={message._id}
                                message={message}
                                currentUserId={currentUser._id}
                                onDelete={deleteMessage}
                            />
                        ))}

                        {/* Typing Indicator */}
                        {typing.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-400 italic">
                                <div className="flex gap-1">
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                                <span>{typing[0].userName} is typing...</span>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Chat Input */}
            <ChatInput
                onSend={sendMessage}
                onTyping={emitTyping}
                onStopTyping={emitStopTyping}
            />
        </div>
    );
};

export default ChatPanel;
