import { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Settings, Moon, Sun, Users, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../ui';

const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const dropdownRef = useRef(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuItems = [
        { icon: User, label: 'My Profile', action: () => navigate('/profile') },
        { icon: Settings, label: 'Settings', action: () => navigate('/settings') },
        {
            icon: theme === 'dark' ? Moon : Sun,
            label: `Appearance (${theme === 'dark' ? 'Dark' : 'Light'})`,
            action: toggleTheme,
            toggle: true
        },
        { divider: true },
        { icon: LogOut, label: 'Sign Out', action: logout, danger: true }
    ];

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
                <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <Avatar name={user?.name} src={user?.avatar} size="md" status="online" />
                <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 glass border border-slate-700 rounded-lg shadow-2xl z-50 animate-slide-down">
                    {/* User Info Header */}
                    <div className="p-4 border-b border-slate-700">
                        <div className="flex items-center gap-3">
                            <Avatar name={user?.name} src={user?.avatar} size="lg" status="online" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        {menuItems.map((item, index) => {
                            if (item.divider) {
                                return <div key={index} className="my-2 border-t border-slate-700" />;
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        item.action?.();
                                        if (!item.toggle && !item.hasSubmenu) {
                                            setIsOpen(false);
                                        }
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${item.danger
                                        ? 'text-danger hover:bg-danger/10'
                                        : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                                        }`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.hasSubmenu && (
                                        <ChevronDown className="h-4 w-4 -rotate-90" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
