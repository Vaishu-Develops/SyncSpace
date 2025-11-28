import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Folder, Users, CheckSquare, Bell, Star, FileText, Calendar, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import UserQuickStats from './UserQuickStats';
import QuickAccess from './QuickAccess';
import useNotifications from '../../hooks/useNotifications';
import Logo from '../Logo';

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
            <div className="w-20 bg-slate-900/80 backdrop-blur-xl border-r border-white/10 h-screen sticky top-0 flex flex-col transition-all duration-300 z-50">
                <div className="p-4 border-b border-white/10 flex justify-center">
                    <Logo showText={false} className="h-10 w-10" />
                </div>

                <nav className="flex-1 px-2 py-6 space-y-4 flex flex-col items-center">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`relative flex items-center justify-center p-3 rounded-xl transition-all duration-300 group ${isActive(item.path)
                                ? 'bg-primary/20 text-primary shadow-glow-primary'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white hover:shadow-glow-primary'
                                }`}
                            title={item.label}
                        >
                            <item.icon className={`h-6 w-6 transition-transform duration-300 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}`} />
                            {item.badge && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-danger rounded-full text-white text-xs flex items-center justify-center border-2 border-slate-900 shadow-glow-danger">
                                    {item.badge > 9 ? '9+' : item.badge}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>

                <button
                    onClick={() => setIsCollapsed(false)}
                    className="p-4 border-t border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors group"
                >
                    <ChevronRight className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
                </button>
            </div>
        );
    }

    return (
        <div className="w-72 bg-slate-900/80 backdrop-blur-xl border-r border-white/10 h-screen sticky top-0 flex flex-col transition-all duration-300 z-50">
            {/* User Quick Stats */}
            <div className="border-b border-white/10 bg-white/5">
                <UserQuickStats />
            </div>

            {/* Primary Navigation */}
            <nav className="px-4 py-6 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                <div className="mb-6 px-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Menu</p>
                    <div className="space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${isActive(item.path)
                                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white shadow-glow-primary border-l-4 border-primary'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white hover:pl-6'
                                    }`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity duration-300 ${isActive(item.path) ? 'opacity-100' : 'group-hover:opacity-50'}`} />

                                <item.icon className={`h-5 w-5 relative z-10 transition-colors duration-300 ${isActive(item.path) ? 'text-primary' : 'group-hover:text-primary'}`} />
                                <span className="flex-1 text-sm font-medium relative z-10">{item.label}</span>

                                {item.badge && (
                                    <span className="relative z-10 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30 shadow-glow-primary">
                                        {item.badge}
                                    </span>
                                )}

                                {isActive(item.path) && (
                                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary shadow-glow-primary animate-pulse" />
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="px-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Access</p>
                    <QuickAccess />
                </div>
            </nav>

            {/* Bottom Section - Fixed */}
            <div className="p-4 border-t border-white/10 bg-slate-900/50 backdrop-blur-md space-y-3">
                {/* Dark Mode Toggle - Visual Only since we are enforcing dark mode for futuristic theme */}
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                            <Moon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-300">Dark Mode</span>
                    </div>
                    <div className="w-8 h-4 bg-primary/30 rounded-full relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 bg-primary rounded-full shadow-glow-primary border-2 border-slate-900"></div>
                    </div>
                </div>

                {/* Collapse Button */}
                <button
                    onClick={() => setIsCollapsed(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-300 group border border-transparent hover:border-white/10"
                >
                    <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="text-sm font-medium">Collapse Sidebar</span>
                </button>
            </div>
        </div>
    );
};

export default EnhancedSidebar;
