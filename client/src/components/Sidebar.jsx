import { Link, useLocation } from 'react-router-dom';
import { Home, Folder, Users, Bell, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { icon: Home, label: 'Home', path: '/dashboard' },
        { icon: Folder, label: 'My Workspaces', path: '/workspaces' },
        { icon: Users, label: 'Teams', path: '/teams' },
        { icon: Bell, label: 'Notifications', path: '/notifications' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const isActive = (path) => location.pathname === path;

    const SidebarContent = () => (
        <>
            <div className="p-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                    SyncSpace
                </h1>
                <button
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden text-gray-400 hover:text-white"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${isActive(item.path)
                            ? 'bg-primary/10 text-primary border-l-4 border-primary'
                            : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                            }`}
                    >
                        <item.icon
                            className={`h-5 w-5 mr-3 transition-colors ${isActive(item.path) ? 'text-primary' : 'text-gray-500 group-hover:text-white'
                                }`}
                        />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-md text-gray-400 hover:text-white shadow-lg border border-slate-700"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex flex-col w-64 bg-slate-800 border-r border-slate-700 h-screen sticky top-0">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Drawer */}
                    <div className="absolute inset-y-0 left-0 w-64 bg-slate-800 border-r border-slate-700 shadow-2xl flex flex-col animate-slide-right">
                        <SidebarContent />
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
