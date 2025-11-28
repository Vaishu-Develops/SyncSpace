import { useState, useEffect } from 'react';
import { Outlet, useParams, Link, useLocation } from 'react-router-dom';
import FuturisticHeader from './FuturisticHeader';
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
                {/* Futuristic Header */}
                <FuturisticHeader
                    title={workspace?.name || 'Loading...'}
                    tabs={tabs}
                    showSearch={true}
                />

                {/* Main Content Area */}
                <main className="flex-1 overflow-hidden flex flex-col">
                    <Outlet context={{ workspaceId }} />
                </main>
            </div>
        </div>
    );
};

export default WorkspaceLayout;
