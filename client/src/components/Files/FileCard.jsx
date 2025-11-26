import React, { useState } from 'react';
import { FileText, Image, Film, Music, Archive, File as FileIcon, Download, Trash2, MoreVertical, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const FileCard = ({ file, onDelete, onDownload }) => {
    const [showMenu, setShowMenu] = useState(false);

    const getFileIcon = (mimeType) => {
        if (mimeType.startsWith('image/')) return <Image className="h-6 w-6" />;
        if (mimeType.startsWith('video/')) return <Film className="h-6 w-6" />;
        if (mimeType.startsWith('audio/')) return <Music className="h-6 w-6" />;
        if (mimeType.includes('pdf')) return <FileText className="h-6 w-6" />;
        if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive className="h-6 w-6" />;
        return <FileIcon className="h-6 w-6" />;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="card hover:border-primary cursor-pointer group relative">
            <div className="flex items-start gap-3">
                {/* File Icon */}
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary flex-shrink-0">
                    {getFileIcon(file.mimeType)}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate group-hover:text-primary transition-colors">
                        {file.originalName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>v{file.version}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}</span>
                        </div>
                    </div>
                    {file.uploadedBy && (
                        <p className="text-xs text-gray-500 mt-1">
                            Uploaded by {file.uploadedBy.name}
                        </p>
                    )}
                </div>

                {/* Actions Menu */}
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-1 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 overflow-hidden">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDownload(file._id);
                                    setShowMenu(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Download
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(file._id);
                                    setShowMenu(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileCard;
