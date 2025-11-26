import { useState, useEffect } from 'react';
import { Outlet, useParams, Link, useLocation } from 'react-router-dom';
import EnhancedSidebar from './Dashboard/EnhancedSidebar';
import { Layout, FileText, MessageSquare, Folder, Settings } from 'lucide-react';
import axios from 'axios';

const WorkspaceLayout = () => {
    const { workspaceId } = useParams();
    const location = useLocation();
    const [workspace, setWorkspace] = useState(null);

    useEffect(() => {
        const fetchWorkspace = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo')).token;
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const { data } = await axios.get(`http://localhost:5000/api/workspaces/${workspaceId}`, config);
                setWorkspace(data);
            } catch (error) {
                console.error('Error fetching workspace:', error);
            }
        };
        fetchWorkspace();
    }, [workspaceId]);

    const tabs = [
        { icon: Layout, label: 'Overview', path: `/workspace/${workspaceId}` },
        { icon: Layout, label: 'Board', path: `/workspace/${workspaceId}/board` },
        { icon: FileText, label: 'Docs', path: `/workspace/${workspaceId}/docs` },
        { icon: MessageSquare, label: 'Chat', path: `/workspace/${workspaceId}/chat` },
        { icon: Folder, label: 'Files', path: `/workspace/${workspaceId}/files` },
        { icon: Settings, label: 'Settings', path: `/workspace/${workspaceId}/settings` },
    ];

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <div className="flex min-h-screen bg-slate-900 text-white">
            <EnhancedSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Workspace Header */}
                <header className="h-16 border-b border-slate-700 flex items-center justify-between px-8 bg-slate-800/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-white">{workspace?.name || 'Loading...'}</h1>
                        <div className="h-6 w-px bg-slate-700"></div>
                        <nav className="flex gap-1">
                            {tabs.map((tab) => (
                                <Link
                                    key={tab.path}
                                    to={tab.path}
                                    className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive(tab.path)
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-400 hover:text-white hover:bg-slate-700'
                                        }`}
                                >
                                    <tab.icon className="h-4 w-4 mr-2" />
                                    {tab.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-hidden flex flex-col">
                    <Outlet context={{ workspaceId }} />
                </main>
            </div>
        </div>
    );
};

export default WorkspaceLayout;
