import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import FileUpload from './FileUpload';
import FileCard from './FileCard';
import { Folder, Loader } from 'lucide-react';

const FileManager = ({ workspaceId, projectId = null }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFiles();
    }, [workspaceId, projectId]);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const params = projectId ? { projectId } : { workspaceId };

            const { data } = await api.get('/api/files', {
                params,
                headers: { Authorization: `Bearer ${token}` }
            });

            setFiles(data);
        } catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (fileId) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;

            const response = await api.get(`/api/files/${fileId}/download`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file');
        }
    };

    const handleDelete = async (fileId) => {
        if (!window.confirm('Are you sure you want to delete this file?')) return;

        try {
            await api.delete(`/api/files/${fileId}`);
            fetchFiles();
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Failed to delete file');
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-900">
                <Loader className="h-8 w-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 bg-slate-900 p-6 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <Folder className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold text-white">Files</h2>
                </div>

                {/* Upload Area */}
                <FileUpload
                    workspaceId={workspaceId}
                    projectId={projectId}
                    onUploadComplete={fetchFiles}
                />

                {/* Files List */}
                <div className="space-y-3">
                    {files.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No files uploaded yet</p>
                            <p className="text-sm text-gray-500 mt-1">Upload your first file above</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-lg font-semibold text-white mb-3">
                                All Files ({files.length})
                            </h3>
                            {files.map((file) => (
                                <FileCard
                                    key={file._id}
                                    file={file}
                                    onDownload={handleDownload}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileManager;
