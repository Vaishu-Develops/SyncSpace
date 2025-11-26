import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

const MessageBubble = ({ message, currentUserId, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const isOwnMessage = message.sender._id === currentUserId;

    return (
        <div className={`flex gap-3 mb-4 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-semibold">
                    {message.sender.name?.charAt(0).toUpperCase()}
                </div>
            </div>

            {/* Message Content */}
            <div className={`flex-1 max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">
                        {message.sender.name}
                    </span>
                    <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </span>
                    {message.isEdited && (
                        <span className="text-xs text-gray-500 italic">(edited)</span>
                    )}
                </div>

                <div className={`relative group ${isOwnMessage ? 'bg-primary/20 border-primary/30' : 'bg-slate-800 border-slate-700'} border rounded-lg p-3`}>
                    <p className="text-sm text-gray-200 whitespace-pre-wrap break-words">
                        {message.content}
                    </p>

                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment, idx) => (
                                <a
                                    key={idx}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs text-primary hover:underline"
                                >
                                    📎 {attachment.filename}
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Message Menu */}
                    {isOwnMessage && (
                        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-1 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors"
                            >
                                <MoreVertical className="h-3 w-3 text-gray-300" />
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 mt-1 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-10">
                                    <button
                                        onClick={() => {
                                            onDelete(message._id);
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
