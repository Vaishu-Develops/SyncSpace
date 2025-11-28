import { useState, useEffect } from 'react';
import { Star, Folder, FileText, File as FileIcon, Search, MoreVertical, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState({
        workspaces: [],
        projects: [],
        documents: [],
        files: []
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const { data } = await axios.get('http://localhost:5000/api/favorites', config);
            setFavorites(data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (itemType, itemId) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post('http://localhost:5000/api/favorites/toggle',
                { itemType, itemId },
                config
            );

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

    const filteredWorkspaces = filterItems(favorites.workspaces);
    const filteredProjects = filterItems(favorites.projects);
    const filteredDocuments = filterItems(favorites.documents);
    const filteredFiles = filterItems(favorites.files);

    const hasAnyFavorites = favorites.workspaces.length > 0 ||
        favorites.projects.length > 0 ||
        favorites.documents.length > 0 ||
        favorites.files.length > 0;

    return (

        <div className="flex flex-col h-full bg-slate-900 text-white">
            {/* Header */}
            <header className="h-16 border-b border-slate-700 flex items-center justify-between px-4 md:px-8 glass sticky top-0 z-10">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Star className="h-6 w-6 text-warning fill-warning" />
                        Favorites
                    </h1>
                    <p className="text-sm text-gray-400">Quick access to your starred items</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {/* Search */}
                    {hasAnyFavorites && (
                        <div className="mb-6">
                            <div className="relative max-w-xl">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search favorites..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : !hasAnyFavorites ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <Star className="h-16 w-16 mb-4 opacity-50" />
                            <p className="text-lg font-medium">No favorites yet</p>
                            <p className="text-sm">Click the star icon on workspaces, projects, or documents to add them here</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Favorite Workspaces */}
                            {filteredWorkspaces.length > 0 && (
                                <section>
                                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <Folder className="h-5 w-5 text-primary" />
                                        Workspaces ({filteredWorkspaces.length})
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredWorkspaces.map((workspace) => (
                                            <Link
                                                key={workspace._id}
                                                to={`/workspace/${workspace._id}/board`}
                                                className="group"
                                            >
                                                <div className="card hover-glow-primary animate-fade-in">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl border border-primary/30 group-hover:scale-110 transition-transform">
                                                            <Folder className="h-6 w-6 text-primary" />
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                toggleFavorite('workspace', workspace._id);
                                                            }}
                                                            className="p-1 rounded hover:bg-slate-700 transition-colors"
                                                            aria-label="Remove from favorites"
                                                        >
                                                            <Star className="h-5 w-5 text-warning fill-warning" />
                                                        </button>
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                                                        {workspace.name}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                                                        {workspace.description || 'No description provided.'}
                                                    </p>
                                                    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                                                        <div className="flex -space-x-2">
                                                            {workspace.members?.slice(0, 3).map((member, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="h-8 w-8 rounded-full border-2 border-slate-800 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xs text-white font-bold"
                                                                    title={member.name}
                                                                >
                                                                    {member.name?.charAt(0).toUpperCase()}
                                                                </div>
                                                            ))}
                                                            {workspace.members?.length > 3 && (
                                                                <div className="h-8 w-8 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center text-xs text-gray-300">
                                                                    +{workspace.members.length - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                            <Clock className="h-3 w-3" />
                                                            <span>Updated recently</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Favorite Projects */}
                            {filteredProjects.length > 0 && (
                                <section>
                                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-secondary" />
                                        Projects ({filteredProjects.length})
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredProjects.map((project) => (
                                            <Link
                                                key={project._id}
                                                to={`/project/${project._id}`}
                                                className="group"
                                            >
                                                <div className="card hover-glow-secondary animate-fade-in">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center border border-secondary/30 group-hover:scale-110 transition-transform">
                                                            <FileText className="h-6 w-6 text-secondary" />
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                toggleFavorite('project', project._id);
                                                            }}
                                                            className="p-1 rounded hover:bg-slate-700 transition-colors"
                                                            aria-label="Remove from favorites"
                                                        >
                                                            <Star className="h-5 w-5 text-warning fill-warning" />
                                                        </button>
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-secondary transition-colors">
                                                        {project.name}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm mb-2">
                                                        {project.workspace?.name}
                                                    </p>
                                                    <p className="text-gray-500 text-xs">
                                                        {project.description || 'No description'}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Favorite Files */}
                            {filteredFiles.length > 0 && (
                                <section>
                                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <FileIcon className="h-5 w-5 text-accent" />
                                        Files ({filteredFiles.length})
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredFiles.map((file) => (
                                            <div
                                                key={file._id}
                                                className="card hover-glow-accent animate-fade-in group"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center border border-accent/30">
                                                        <FileIcon className="h-6 w-6 text-accent" />
                                                    </div>
                                                    <button
                                                        onClick={() => toggleFavorite('file', file._id)}
                                                        className="p-1 rounded hover:bg-slate-700 transition-colors"
                                                        aria-label="Remove from favorites"
                                                    >
                                                        <Star className="h-5 w-5 text-warning fill-warning" />
                                                    </button>
                                                </div>
                                                <h3 className="text-sm font-medium text-white mb-2 truncate" title={file.originalName}>
                                                    {file.originalName}
                                                </h3>
                                                <p className="text-xs text-gray-400">
                                                    {(file.size / 1024).toFixed(2)} KB
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(file.uploadedAt || file.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FavoritesPage;
