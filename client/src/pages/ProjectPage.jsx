import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import {
    Layout,
    FileText,
    Folder,
    Activity,
    ChevronRight,
    Users,
    Plus,
    Search,
    Settings
} from 'lucide-react';
import { Button, AvatarGroup } from '../components/ui';
import Board from '../components/Board';
import DocumentEditor from '../components/DocumentEditor';

const ProjectPage = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [activeTab, setActiveTab] = useState('board');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    const fetchProject = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await api.get(`/api/projects/${projectId}`);
            setProject(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching project:', error);
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Project...</div>;
    if (!project) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Project not found</div>;

    return (

        <div className="flex flex-col h-full bg-slate-900 text-white">
            {/* Top Bar / Header */}
            <header className="h-16 border-b border-slate-700 bg-slate-800/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link to={`/workspace/${project.workspace._id}/board`} className="hover:text-white transition-colors">{project.workspace.name}</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-white font-medium">{project.name}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search in project..."
                            className="bg-slate-900/50 border border-slate-700 rounded-full pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary w-64"
                        />
                    </div>

                    {/* Members */}
                    <div className="flex items-center gap-2">
                        <AvatarGroup
                            avatars={project.members.map(m => ({ name: m.name, src: m.avatar }))}
                            max={3}
                            size="sm"
                        />
                        <button className="h-8 w-8 rounded-full border border-dashed border-gray-500 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="w-px h-6 bg-slate-700 mx-2"></div>

                    <button className="text-gray-400 hover:text-white transition-colors">
                        <Settings className="h-5 w-5" />
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Tabs */}
                <div className="px-6 pt-6 border-b border-slate-700 bg-slate-900">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setActiveTab('board')}
                            className={`pb-3 flex items-center gap-2 text-sm font-medium transition-colors relative ${activeTab === 'board' ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Layout className="h-4 w-4" />
                            Kanban Board
                            {activeTab === 'board' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('docs')}
                            className={`pb-3 flex items-center gap-2 text-sm font-medium transition-colors relative ${activeTab === 'docs' ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                        >
                            <FileText className="h-4 w-4" />
                            Documents
                            {activeTab === 'docs' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('files')}
                            className={`pb-3 flex items-center gap-2 text-sm font-medium transition-colors relative ${activeTab === 'files' ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Folder className="h-4 w-4" />
                            Files
                            {activeTab === 'files' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`pb-3 flex items-center gap-2 text-sm font-medium transition-colors relative ${activeTab === 'activity' ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Activity className="h-4 w-4" />
                            Activity
                            {activeTab === 'activity' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden bg-slate-900 relative">
                    {activeTab === 'board' && (
                        <Board projectId={projectId} workspaceId={project.workspace._id} />
                    )}
                    {activeTab === 'docs' && (
                        <DocumentEditor projectId={projectId} workspaceId={project.workspace._id} />
                    )}
                    {activeTab === 'files' && (
                        <div className="p-8 text-center text-gray-400">
                            <Folder className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-medium text-white mb-2">Files</h3>
                            <p>File management coming soon...</p>
                        </div>
                    )}
                    {activeTab === 'activity' && (
                        <div className="p-8 text-center text-gray-400">
                            <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-medium text-white mb-2">Activity Log</h3>
                            <p>Project activity history coming soon...</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProjectPage;
