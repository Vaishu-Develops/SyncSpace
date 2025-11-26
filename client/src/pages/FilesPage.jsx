import { useState, useEffect } from 'react';
import { Upload, File, Image, FileText, Download, Trash2, Search, Filter, Grid, List as ListIcon } from 'lucide-react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Button } from '../components/ui';

const FilesPage = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [filterType, setFilterType] = useState('all'); // 'all', 'images', 'documents', 'other'

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Fetch all files across all workspaces
            const { data } = await axios.get('http://localhost:5000/api/files', config);
            setFiles(data);
        } catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (fileId) => {
        if (!window.confirm('Are you sure you want to delete this file?')) return;

        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.delete(`http://localhost:5000/api/files/${fileId}`, config);
            setFiles(files.filter(f => f._id !== fileId));
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const handleDownload = (file) => {
        window.open(`http://localhost:5000${file.url}`, '_blank');
    };

    const getFileIcon = (mimeType) => {
        if (mimeType?.startsWith('image/')) return <Image className="h-5 w-5" />;
        if (mimeType?.includes('pdf') || mimeType?.includes('document')) return <FileText className="h-5 w-5" />;
        return <File className="h-5 w-5" />;
    };

    const filteredFiles = files.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            filterType === 'all' ||
            (filterType === 'images' && file.mimeType?.startsWith('image/')) ||
            (filterType === 'documents' && (file.mimeType?.includes('pdf') || file.mimeType?.includes('document'))) ||
            (filterType === 'other' && !file.mimeType?.startsWith('image/') && !file.mimeType?.includes('pdf') && !file.mimeType?.includes('document'));

        return matchesSearch && matchesFilter;
    });

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="flex min-h-screen bg-slate-900 text-white">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 border-b border-slate-700 flex items-center justify-between px-4 md:px-8 glass sticky top-0 z-10">
                    <div>
                        <h1 className="text-2xl font-bold text-white">All Files</h1>
                        <p className="text-sm text-gray-400">{filteredFiles.length} files</p>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Search and Filters */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search files..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                            </div>

                            <div className="flex gap-2">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="all">All Files</option>
                                    <option value="images">Images</option>
                                    <option value="documents">Documents</option>
                                    <option value="other">Other</option>
                                </select>

                                <div className="flex border border-slate-700 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}
                                        aria-label="Grid view"
                                    >
                                        <Grid className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}
                                        aria-label="List view"
                                    >
                                        <ListIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Files Grid/List */}
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : filteredFiles.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                <Upload className="h-16 w-16 mb-4 opacity-50" />
                                <p className="text-lg font-medium">No files found</p>
                                <p className="text-sm">Upload files in your workspaces to see them here</p>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredFiles.map((file) => (
                                    <div
                                        key={file._id}
                                        className="card hover-glow-primary group"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary border border-primary/30">
                                                {getFileIcon(file.mimeType)}
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDownload(file)}
                                                    className="p-1.5 hover:bg-slate-700 rounded text-gray-400 hover:text-primary transition-colors"
                                                    title="Download"
                                                    aria-label="Download file"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(file._id)}
                                                    className="p-1.5 hover:bg-slate-700 rounded text-gray-400 hover:text-danger transition-colors"
                                                    title="Delete"
                                                    aria-label="Delete file"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="text-sm font-medium text-white mb-1 truncate" title={file.name}>
                                            {file.name}
                                        </h3>
                                        <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(file.uploadedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredFiles.map((file) => (
                                    <div
                                        key={file._id}
                                        className="card flex items-center justify-between hover-glow-primary group"
                                    >
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary border border-primary/30 flex-shrink-0">
                                                {getFileIcon(file.mimeType)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-white truncate" title={file.name}>
                                                    {file.name}
                                                </h3>
                                                <p className="text-xs text-gray-400">
                                                    {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleDownload(file)}
                                                className="p-2 hover:bg-slate-700 rounded text-gray-400 hover:text-primary transition-colors"
                                                title="Download"
                                                aria-label="Download file"
                                            >
                                                <Download className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(file._id)}
                                                className="p-2 hover:bg-slate-700 rounded text-gray-400 hover:text-danger transition-colors"
                                                title="Delete"
                                                aria-label="Delete file"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FilesPage;
