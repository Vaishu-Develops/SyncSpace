import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Bell, MoreVertical, Folder, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CreateWorkspaceModal from '../components/CreateWorkspaceModal';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarGroup, Badge, Button } from '../components/ui';

const Dashboard = () => {
    const [workspaces, setWorkspaces] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchWorkspaces();
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

    const handleWorkspaceCreated = (newWorkspace) => {
        setWorkspaces([...workspaces, newWorkspace]);
    };

    const filteredWorkspaces = workspaces.filter((workspace) =>
        workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workspace.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-slate-900 text-white">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 border-b border-slate-700 flex items-center justify-between px-4 md:px-8 glass sticky top-0 z-10">
                    <div className="flex items-center flex-1 max-w-xl">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search workspaces, projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-[0_0_0_rgba(6,182,212,0)] focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 ml-6">
                        <button className="relative text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800">
                            <Bell className="h-6 w-6" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-danger rounded-full animate-pulse"></span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-white">{user?.name}</p>
                                <p className="text-xs text-gray-400">{user?.email}</p>
                            </div>
                            <Avatar
                                name={user?.name}
                                size="md"
                                status="online"
                            />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">My Workspaces</h1>
                                <p className="text-gray-400">Manage your projects and collaborate with your team</p>
                            </div>
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                variant="primary"
                                size="md"
                                icon={<Plus className="h-5 w-5" />}
                            >
                                New Workspace
                            </Button>
                        </div>

                        {/* Workspaces Grid */}
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
                                                    // Handle more options
                                                }}
                                                className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-700"
                                            >
                                                <MoreVertical className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                                            {workspace.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                                            {workspace.description || 'No description provided.'}
                                        </p>
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
                                                <span>Updated 2h ago</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}

                            {/* Create New Card (Empty State) */}
                            {workspaces.length === 0 && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
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

                        {/* No Results */}
                        {searchQuery && filteredWorkspaces.length === 0 && workspaces.length > 0 && (
                            <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
                                <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                                    <Search className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-gray-400 font-medium">No workspaces found</p>
                                <p className="text-sm text-gray-500 mt-1">Try adjusting your search query</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <CreateWorkspaceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onWorkspaceCreated={handleWorkspaceCreated}
            />
        </div>
    );
};

export default Dashboard;
