import { Pin, Clock, Zap, Palette, Code, Smartphone, Plus, FileText, UserPlus } from 'lucide-react';

const QuickAccess = () => {
    // Mock data - replace with actual data
    const pinnedWorkspaces = [
        { id: 1, name: 'Design Team', icon: Palette, color: 'from-pink-500 to-rose-500' },
        { id: 2, name: 'Engineering', icon: Code, color: 'from-blue-500 to-cyan-500' },
        { id: 3, name: 'Mobile Dev', icon: Smartphone, color: 'from-purple-500 to-violet-500' }
    ];

    const recentItems = [
        { id: 1, name: 'Sprint Planning Doc', type: 'document' },
        { id: 2, name: 'Q1 Budget Task', type: 'task' },
        { id: 3, name: 'Brand Guidelines', type: 'document' }
    ];

    const quickActions = [
        { id: 1, icon: Plus, label: 'New Task', color: 'text-primary' },
        { id: 2, icon: FileText, label: 'New Doc', color: 'text-secondary' },
        { id: 3, icon: UserPlus, label: 'Invite Member', color: 'text-accent' }
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
                    {pinnedWorkspaces.map((workspace) => (
                        <button
                            key={workspace.id}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors group"
                        >
                            <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${workspace.color} flex items-center justify-center`}>
                                <workspace.icon className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                {workspace.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recently Viewed */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <h3 className="text-xs font-semibold text-gray-400 uppercase">Recently Viewed</h3>
                </div>
                <div className="space-y-1">
                    {recentItems.map((item) => (
                        <button
                            key={item.id}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors group text-left"
                        >
                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0"></div>
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors truncate">
                                {item.name}
                            </span>
                        </button>
                    ))}
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
