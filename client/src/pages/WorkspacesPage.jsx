import { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, List, Filter, Plus, Folder, MoreVertical, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, AvatarGroup } from '../components/ui';
import EnhancedSidebar from '../components/Dashboard/EnhancedSidebar';
import CommandBar from '../components/Dashboard/CommandBar';
import CreateWorkspaceModal from '../components/Dashboard/CreateWorkspaceModal';
import useFavorites from '../hooks/useFavorites';

const WorkspacesPage = () => {
    const [workspaces, setWorkspaces] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [editingWorkspace, setEditingWorkspace] = useState(null);
    const { toggleFavorite, isFavorite } = useFavorites();

    useEffect(() => {
        fetchWorkspaces();
        const handleClickOutside = () => setActiveDropdown(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchWorkspaces = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const { data } = await axios.get('http://localhost:5000/api/workspaces', config);
            setWorkspaces(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching workspaces:', error);
            setLoading(false);
        }
    };

    const handleDeleteWorkspace = async (workspaceId) => {
        if (!window.confirm('Are you sure you want to delete this workspace?')) return;

        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/workspaces/${workspaceId}`, config);
            fetchWorkspaces();
        } catch (error) {
            console.error('Error deleting workspace:', error);
            alert('Failed to delete workspace');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <CommandBar onCreateWorkspace={() => {
                setEditingWorkspace(null);
                setIsCreateModalOpen(true);
            }} />

            <div className="flex flex-1 overflow-hidden">
                <EnhancedSidebar />

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">All Workspaces</h1>
                                <p className="text-gray-400">View and manage all your workspaces in one place</p>
                            </div>
                            <Button
                                variant="primary"
                                icon={<Plus className="h-4 w-4" />}
                                onClick={() => {
                                    setEditingWorkspace(null);
                                    setIsCreateModalOpen(true);
                                }}
                            >
                                New Workspace
                            </Button>
                        </div>

                        {/* View Controls */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <Grid className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-12 text-gray-400">Loading workspaces...</div>
                        ) : workspaces.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl">
                                <Folder className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-white mb-2">No workspaces found</h3>
                                <p className="text-gray-400 mb-6">Get started by creating your first workspace</p>
                                <Button variant="primary" onClick={() => {
                                    setEditingWorkspace(null);
                                    setIsCreateModalOpen(true);
                                }}>
                                    Create Workspace
                                </Button>
                            </div>
                        ) : (
                            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                                {workspaces.map((workspace) => (
                                    <div key={workspace._id} className="relative group">
                                        <Link
                                            to={`/workspace/${workspace._id}/board`}
                                            className={`block glass border border-slate-700 rounded-xl overflow-hidden hover:border-primary/50 transition-all ${viewMode === 'list' ? 'flex items-center p-4 gap-6' : 'p-6'}`}
                                        >
                                            <div className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-primary ${viewMode === 'list' ? 'h-12 w-12' : 'h-12 w-12 mb-4'}`}>
                                                <Folder className="h-6 w-6" />
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors mb-1">
                                                    {workspace.name}
                                                </h3>
                                                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                                                    {workspace.description || 'No description provided'}
                                                </p>

                                                {viewMode === 'grid' && (
                                                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            Updated recently
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>

                                        {/* Star and 3-Dot Menu */}
                                        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 z-10">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleFavorite('workspace', workspace._id);
                                                }}
                                                className={`p-1 rounded hover:bg-slate-700 transition-colors ${isFavorite(workspace._id) ? 'text-warning' : 'text-gray-400 hover:text-white'
                                                    }`}
                                                aria-label="Toggle favorite"
                                            >
                                                <Star className={`h-5 w-5 ${isFavorite(workspace._id) ? 'fill-warning' : ''}`} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setActiveDropdown(activeDropdown === workspace._id ? null : workspace._id);
                                                }}
                                                className="p-1 rounded hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
                                            >
                                                <MoreVertical className="h-5 w-5" />
                                            </button>
                                        </div>

                                        {/* Dropdown */}
                                        {activeDropdown === workspace._id && (
                                            <div className="absolute top-10 right-4 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 animate-scale-in overflow-hidden">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setEditingWorkspace(workspace);
                                                        setIsCreateModalOpen(true);
                                                        setActiveDropdown(null);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
                                                >
                                                    Edit Workspace
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleDeleteWorkspace(workspace._id);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
                                                >
                                                    Delete Workspace
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <CreateWorkspaceModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingWorkspace(null);
                }}
                onSuccess={fetchWorkspaces}
                initialData={editingWorkspace}
            />
        </div>
    );
};

export default WorkspacesPage;
