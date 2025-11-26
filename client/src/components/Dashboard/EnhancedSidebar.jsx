import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Folder, Users, CheckSquare, Bell, Star, FileText, Calendar, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import UserQuickStats from './UserQuickStats';
import QuickAccess from './QuickAccess';
import useNotifications from '../../hooks/useNotifications';

const EnhancedSidebar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { unreadCount } = useNotifications();

    const navItems = [
        { icon: Home, label: 'Home', path: '/', badge: null },
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', badge: null },
        { icon: Folder, label: 'Workspaces', path: '/workspaces', badge: null },
        { icon: Users, label: 'Teams', path: '/teams', badge: null },
        { icon: CheckSquare, label: 'My Tasks', path: '/tasks', badge: null },
        { icon: Bell, label: 'Notifications', path: '/notifications', badge: unreadCount > 0 ? unreadCount : null },
        { icon: Star, label: 'Favorites', path: '/favorites', badge: null },
        { icon: FileText, label: 'Files', path: '/files', badge: null },
        { icon: Calendar, label: 'Calendar', path: '/calendar', badge: null }
    ];

    const isActive = (path) => location.pathname === path;

    if (isCollapsed) {
        return (
            <div className="w-16 bg-slate-800 border-r border-slate-700 h-screen sticky top-0 flex flex-col">
                <div className="p-4 border-b border-slate-700">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-white font-bold">S</span>
                    </div>
                </div>

                <nav className="flex-1 px-2 py-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`relative flex items-center justify-center p-3 rounded-lg transition-all group ${isActive(item.path)
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                }`}
                            title={item.label}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.badge && (
                                <span className="absolute top-1 right-1 h-4 w-4 bg-danger rounded-full text-white text-xs flex items-center justify-center">
                                    {item.badge > 9 ? '9+' : item.badge}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>

                <button
                    onClick={() => setIsCollapsed(false)}
                    className="p-4 border-t border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
            </div>
        );
    }

    return (
        <div className="w-64 bg-slate-800 border-r border-slate-700 h-screen sticky top-0 flex flex-col">
            {/* User Quick Stats */}
            <UserQuickStats />

            {/* Primary Navigation */}
            <nav className="px-4 py-4 space-y-1 border-b border-slate-700">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${isActive(item.path)
                            ? 'bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 text-primary border-l-2 border-primary font-semibold'
                            : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                            }`}
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="flex-1 text-sm">{item.label}</span>
                        {item.badge && (
                            <span className="badge-primary text-xs">
                                {item.badge}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Quick Access - Scrollable */}
            <div className="flex-1 overflow-y-auto">
                <QuickAccess />
            </div>

            {/* Bottom Section - Fixed */}
            <div className="p-4 border-t border-slate-700 space-y-2">
                {/* Dark Mode Toggle */}
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-slate-700 hover:text-white transition-colors">
                    <Moon className="h-4 w-4" />
                    <span className="text-sm flex-1 text-left">Dark Mode</span>
                    <div className="w-10 h-5 bg-primary rounded-full relative flex items-center">
                        <div className="absolute right-0.5 h-4 w-4 bg-white rounded-full transition-transform"></div>
                    </div>
                </button>

                {/* Collapse Button */}
                <button
                    onClick={() => setIsCollapsed(true)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-slate-700 hover:text-white transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="text-sm">Collapse Sidebar</span>
                </button>
            </div>
        </div>
    );
};

export default EnhancedSidebar;
