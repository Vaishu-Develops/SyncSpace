import { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, List, BarChart3, Filter, Plus, MoreVertical, Folder, Clock, Users as UsersIcon, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import CommandBar from '../components/Dashboard/CommandBar';
import EnhancedSidebar from '../components/Dashboard/EnhancedSidebar';
import CreateWorkspaceModal from '../components/Dashboard/CreateWorkspaceModal';
import { Avatar, AvatarGroup, Button } from '../components/ui';

const EnhancedDashboard = () => {
    const [workspaces, setWorkspaces] = useState([]);
    const [projects, setProjects] = useState([]);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('recent');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [editingWorkspace, setEditingWorkspace] = useState(null);

    useEffect(() => {
        fetchWorkspaces();
        fetchProjects();
        // Close dropdown on click outside
        const handleClickOutside = () => setActiveDropdown(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchWorkspaces = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get('http://localhost:5000/api/workspaces', config);
            setWorkspaces(data);
        } catch (error) {
            console.error('Error fetching workspaces:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get('http://localhost:5000/api/projects', config);
            // We need to fetch workspace details for each project if not populated
            // But let's assume the backend populates it if we ask, or we can fetch it.
            // Actually, let's update the backend to populate workspace for getProjects too.
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
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

    const handleCreateProject = async () => {
        const name = prompt('Enter project name:');
        if (!name) return;

        // For now, we'll just pick the first workspace or ask for ID. 
        // Ideally, we need a modal to select workspace.
        // Let's just use a simple prompt for now to unblock.
        const description = prompt('Enter description (optional):');

        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // We need a workspace ID. Let's find one or ask.
            // For this MVP step, let's just use the first workspace if available.
            if (workspaces.length === 0) {
                alert('Please create a workspace first.');
                return;
            }

            const workspaceId = workspaces[0]._id; // Default to first for now

            await axios.post('http://localhost:5000/api/projects', {
                name,
                description,
                workspaceId
            }, config);

            fetchProjects();
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            {/* Command Bar */}
            <CommandBar onCreateWorkspace={() => {
                setEditingWorkspace(null);
                setIsCreateModalOpen(true);
            }} />

            <div className="flex flex-1 overflow-hidden">
                {/* Enhanced Sidebar */}
                <EnhancedSidebar />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto p-8">

                        {/* Projects Section */}
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Projects</h2>
                                    <p className="text-gray-400">Active projects across all workspaces</p>
                                </div>
                                <Button
                                    onClick={handleCreateProject}
                                    icon={<Plus className="h-4 w-4" />}
                                >
                                    New Project
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project) => (
                                    <Link
                                        key={project._id}
                                        to={`/project/${project._id}`}
                                        className="block"
                                    >
                                        <div className="card hover-glow-primary animate-fade-in relative overflow-hidden group">
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-secondary"></div>

                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                                                        <Briefcase className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-xs text-gray-500 bg-slate-800 px-2 py-1 rounded-full border border-slate-700 mb-1">
                                                            Active
                                                        </span>
                                                        {project.workspace && (
                                                            <span className="text-[10px] text-primary uppercase tracking-wider font-bold">
                                                                {project.workspace.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent transition-colors">
                                                    {project.name}
                                                </h3>
                                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                                    {project.description || 'No description'}
                                                </p>

                                                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Clock className="h-3 w-3" />
                                                        <span>Updated recently</span>
                                                    </div>
                                                    <AvatarGroup
                                                        avatars={[
                                                            { name: 'User 1' },
                                                            { name: 'User 2' }
                                                        ]}
                                                        max={3}
                                                        size="xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}

                                {projects.length === 0 && (
                                    <button
                                        onClick={handleCreateProject}
                                        className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-700 rounded-xl hover:border-accent hover:bg-slate-800/50 transition-all group animate-fade-in"
                                    >
                                        <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-accent/20 transition-all">
                                            <Plus className="h-6 w-6 text-gray-400 group-hover:text-accent transition-colors" />
                                        </div>
                                        <p className="text-gray-400 font-medium group-hover:text-white transition-colors">Create new project</p>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Workspaces Section */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">My Workspaces</h1>
                                <p className="text-gray-400">Manage your projects and collaborate with your team</p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* View Toggle */}
                                <div className="flex items-center gap-1 glass rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded transition-colors ${viewMode === 'grid'
                                            ? 'bg-primary text-white'
                                            : 'text-gray-400 hover:text-white'
                                            }`}
                                        title="Grid View"
                                    >
                                        <Grid className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded transition-colors ${viewMode === 'list'
                                            ? 'bg-primary text-white'
                                            : 'text-gray-400 hover:text-white'
                                            }`}
                                        title="List View"
                                    >
                                        <List className="h-4 w-4" />
                                    </button>
                                    <button
                                        className="p-2 rounded text-gray-400 hover:text-white transition-colors"
                                        title="Stats View"
                                    >
                                        <BarChart3 className="h-4 w-4" />
                                    </button>
                                </div>

                                <Button
                                    variant="outline"
                                    size="md"
                                    icon={<Filter className="h-4 w-4" />}
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    Filter
                                </Button>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 glass rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="recent">Sort: Recent</option>
                                    <option value="name">Sort: Name</option>
                                    <option value="activity">Sort: Activity</option>
                                </select>
                            </div>
                        </div>

                        {/* Filter Panel */}
                        {showFilters && (
                            <div className="glass rounded-lg p-6 mb-6 animate-slide-down">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Filter className="h-5 w-5" />
                                    Filter Workspaces
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Status</label>
                                        <div className="flex gap-3">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="rounded" defaultChecked />
                                                <span className="text-sm text-white">Active</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="rounded" />
                                                <span className="text-sm text-white">Archived</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Team</label>
                                        <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                                            <option>All Teams</option>
                                            <option>Acme Corp</option>
                                            <option>Design Studio</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Activity</label>
                                        <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                                            <option>Last 7 days</option>
                                            <option>Last 30 days</option>
                                            <option>Last 90 days</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-4">
                                    <Button variant="ghost" size="sm">Clear All</Button>
                                    <Button variant="primary" size="sm">Apply Filters</Button>
                                </div>
                            </div>
                        )}

                        {/* Workspace Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {workspaces.map((workspace) => (
                                <div key={workspace._id} className="relative group">
                                    <Link
                                        to={`/workspace/${workspace._id}/board`}
                                        className="block"
                                    >
                                        <div className="card hover-glow-primary animate-fade-in relative overflow-hidden">
                                            {/* Gradient Header */}
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>

                                            <div className="flex justify-between items-start mb-4">
                                                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl border border-primary/30 group-hover:scale-110 transition-transform">
                                                    <Folder className="h-6 w-6 text-primary" />
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                                                {workspace.name}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                                                {workspace.description || 'No description provided.'}
                                            </p>

                                            {/* Stats */}
                                            <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <span className="text-primary">⚡</span>
                                                    <span>24 tasks</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <span className="text-secondary">📄</span>
                                                    <span>8 docs</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <span className="text-accent">💬</span>
                                                    <span>156 msgs</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                                                <AvatarGroup
                                                    avatars={[
                                                        { name: 'User 1' },
                                                        { name: 'User 2' },
                                                        { name: 'User 3' },
                                                    ]}
                                                    max={3}
                                                    size="sm"
                                                />
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Clock className="h-3 w-3" />
                                                    <span>5m ago</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* 3-Dot Menu Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setActiveDropdown(activeDropdown === workspace._id ? null : workspace._id);
                                        }}
                                        className="absolute top-4 right-4 p-1 rounded hover:bg-slate-700 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 z-10"
                                    >
                                        <MoreVertical className="h-5 w-5" />
                                    </button>

                                    {/* Dropdown Menu */}
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

                            {/* Empty State / Create New */}
                            {workspaces.length === 0 && (
                                <button
                                    onClick={() => {
                                        setEditingWorkspace(null);
                                        setIsCreateModalOpen(true);
                                    }}
                                    className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-700 rounded-xl hover:border-primary hover:bg-slate-800/50 transition-all group animate-fade-in"
                                >
                                    <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                                        <Plus className="h-8 w-8 text-gray-400 group-hover:text-primary transition-colors" />
                                    </div>
                                    <p className="text-gray-400 font-medium group-hover:text-white transition-colors">Create your first workspace</p>
                                    <p className="text-sm text-gray-500 mt-1">Get started by creating a new workspace</p>
                                </button>
                            )}
                        </div>
                    </div>
                </main>

                {/* Create/Edit Workspace Modal */}
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
        </div>
    );
};

export default EnhancedDashboard;
