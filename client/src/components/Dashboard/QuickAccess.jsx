import { Pin, Clock, Zap, Palette, Code, Smartphone, Plus, FileText, UserPlus, Folder } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';

const QuickAccess = () => {
    const { pinnedWorkspaces, recentItems, loading } = useDashboard();
    const navigate = useNavigate();

    const quickActions = [
        {
            id: 1,
            icon: Plus,
            label: 'New Task',
            color: 'text-primary',
            action: () => navigate('/tasks?create=true')
        },
        {
            id: 2,
            icon: FileText,
            label: 'New Doc',
            color: 'text-secondary',
            action: () => navigate('/files?create=true')
        },
        {
            id: 3,
            icon: UserPlus,
            label: 'Invite Member',
            color: 'text-accent',
            action: () => navigate('/teams')
        }
    ];

    return (
        <div className="px-4 py-4 space-y-6">
            {/* Pinned Workspaces */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Pin className="h-4 w-4 text-gray-400" />
                    <h3 className="text-xs font-semibold text-gray-400 uppercase">Pinned Workspaces</h3>
                </div>
                <div className="space-y-1">
                    {loading ? (
                        <div className="text-xs text-gray-500 p-2">Loading...</div>
                    ) : pinnedWorkspaces.length === 0 ? (
                        <div className="text-xs text-gray-500 p-2 italic">
                            No pinned workspaces. Pin one from the Workspaces page!
                        </div>
                    ) : (
                        pinnedWorkspaces.map((workspace) => (
                            <Link
                                key={workspace._id}
                                to={`/workspace/${workspace._id}/board`}
                                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors group"
                            >
                                <div className={`h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center`}>
                                    <Folder className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-sm text-gray-300 group-hover:text-white transition-colors truncate">
                                    {workspace.name}
                                </span>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Recently Viewed */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <h3 className="text-xs font-semibold text-gray-400 uppercase">Recently Viewed</h3>
                </div>
                <div className="space-y-1">
                    {loading ? (
                        <div className="text-xs text-gray-500 p-2">Loading...</div>
                    ) : recentItems.length === 0 ? (
                        <div className="text-xs text-gray-500 p-2 italic">
                            No recent items found.
                        </div>
                    ) : (
                        recentItems.map((item) => (
                            <Link
                                key={item.id}
                                to={item.link}
                                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors group text-left"
                            >
                                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${item.type === 'task' ? 'bg-primary' : 'bg-secondary'}`}></div>
                                <span className="text-sm text-gray-300 group-hover:text-white transition-colors truncate">
                                    {item.name}
                                </span>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-4 w-4 text-gray-400" />
                    <h3 className="text-xs font-semibold text-gray-400 uppercase">Quick Actions</h3>
                </div>
                <div className="space-y-1">
                    {quickActions.map((action) => (
                        <button
                            key={action.id}
                            onClick={action.action}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors group"
                        >
                            <action.icon className={`h-4 w-4 ${action.color}`} />
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                {action.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuickAccess;
