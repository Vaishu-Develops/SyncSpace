import { useState, useEffect } from 'react';
import { Star, Folder, FileText, File as FileIcon, Search, MoreVertical, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import api from '../utils/api';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState({
        workspaces: [],
        projects: [],
        documents: [],
        files: []
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const { data } = await api.get('/api/favorites');
            setFavorites(data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (itemType, itemId) => {
        try {
            await api.post('/api/favorites/toggle', { itemType, itemId });
            // Refresh favorites
            fetchFavorites();
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const filterItems = (items, searchField = 'name') => {
        if (!searchQuery) return items;
        return items.filter(item =>
            item[searchField]?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const FavoriteCard = ({ item, type, icon: Icon }) => (
        <div className="card p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-medium">{item.name || item.title}</h3>
                        <p className="text-sm text-gray-500">
                            {type === 'files' ? item.originalName : item.description}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => toggleFavorite(type, item._id)}
                    className="text-yellow-500 hover:text-yellow-600"
                >
                    <Star className="h-4 w-4 fill-current" />
                </button>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                            {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    {item.members && (
                        <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{item.members.length} members</span>
                        </div>
                    )}
                </div>
                <Link
                    to={getItemLink(item, type)}
                    className="text-primary hover:text-primary/80 font-medium"
                >
                    Open →
                </Link>
            </div>
        </div>
    );

    const getItemLink = (item, type) => {
        switch (type) {
            case 'workspaces':
                return `/workspace/${item._id}`;
            case 'projects':
                return `/project/${item._id}`;
            case 'documents':
                return `/workspace/${item.workspace}/document/${item._id}`;
            case 'files':
                return `/workspace/${item.workspace}/files`;
            default:
                return '/';
        }
    };

    const tabs = [
        { id: 'all', label: 'All', count: Object.values(favorites).flat().length },
        { id: 'workspaces', label: 'Workspaces', count: favorites.workspaces?.length || 0 },
        { id: 'projects', label: 'Projects', count: favorites.projects?.length || 0 },
        { id: 'documents', label: 'Documents', count: favorites.documents?.length || 0 },
        { id: 'files', label: 'Files', count: favorites.files?.length || 0 }
    ];

    const getDisplayItems = () => {
        if (activeTab === 'all') {
            return [
                ...filterItems(favorites.workspaces || []).map(item => ({ ...item, type: 'workspaces' })),
                ...filterItems(favorites.projects || []).map(item => ({ ...item, type: 'projects' })),
                ...filterItems(favorites.documents || [], 'title').map(item => ({ ...item, type: 'documents' })),
                ...filterItems(favorites.files || [], 'originalName').map(item => ({ ...item, type: 'files' }))
            ];
        }
        return filterItems(favorites[activeTab] || [], activeTab === 'documents' ? 'title' : activeTab === 'files' ? 'originalName' : 'name')
            .map(item => ({ ...item, type: activeTab }));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'workspaces': return Folder;
            case 'projects': return Folder;
            case 'documents': return FileText;
            case 'files': return FileIcon;
            default: return Folder;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const displayItems = getDisplayItems();

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Favorites</h1>
                    <p className="text-gray-600 dark:text-gray-400">Quick access to your starred items</p>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search favorites..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                            activeTab === tab.id
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        {tab.label}
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                            activeTab === tab.id
                                ? 'bg-primary/10 text-primary'
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                        }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Content */}
            {displayItems.length === 0 ? (
                <div className="text-center py-12">
                    <Star className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {searchQuery ? 'No matching favorites' : 'No favorites yet'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        {searchQuery 
                            ? 'Try adjusting your search terms or browse different categories.'
                            : 'Start adding items to your favorites by clicking the star icon on workspaces, projects, documents, and files.'
                        }
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {displayItems.map((item) => (
                        <FavoriteCard
                            key={`${item.type}-${item._id}`}
                            item={item}
                            type={item.type}
                            icon={getIcon(item.type)}
                        />
                    ))}
                </div>
            )}

            {/* File size display helper - only shown for files */}
            {activeTab === 'files' && displayItems.some(item => item.size) && (
                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                    {displayItems.filter(item => item.type === 'files').map(file => (
                        <div key={file._id} className="flex justify-between py-1">
                            <span>{file.originalName}</span>
                            <span>
                                {file.size && (
                                    <>
                                        {(file.size / 1024 / 1024).toFixed(2)} MB •{' '}
                                    </>
                                )}
                                {new Date(file.uploadedAt || file.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;