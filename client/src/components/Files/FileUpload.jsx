import React, { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import axios from 'axios';

const FileUpload = ({ workspaceId, projectId, onUploadComplete }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            await uploadFiles(files);
        }
    }, [workspaceId, projectId]);

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            await uploadFiles(files);
        }
    };

    const uploadFiles = async (files) => {
        setUploading(true);

        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;

            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('workspaceId', workspaceId);
                if (projectId) formData.append('projectId', projectId);

                await api.post('/api/files', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                });
            }

            onUploadComplete?.();
        } catch (error) {
            console.error('Error uploading files:', error);
            alert('Failed to upload files');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging
                    ? 'border-primary bg-primary/10'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
        >
            {uploading ? (
                <div className="space-y-3">
                    <div className="h-12 w-12 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-primary animate-pulse" />
                    </div>
                    <p className="text-white font-medium">Uploading...</p>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-primary h-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-400">{uploadProgress}%</p>
                </div>
            ) : (
                <>
                    <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-white font-medium mb-2">
                        {isDragging ? 'Drop files here' : 'Drag and drop files here'}
                    </p>
                    <p className="text-sm text-gray-400 mb-4">or</p>
                    <label className="inline-block">
                        <input
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <span className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors cursor-pointer inline-block">
                            Browse Files
                        </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-4">Maximum file size: 50MB</p>
                </>
            )}
        </div>
    );
};

export default FileUpload;
