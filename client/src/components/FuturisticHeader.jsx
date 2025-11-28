import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Menu, X } from 'lucide-react';
import GlobalSearch from './Dashboard/GlobalSearch';
import Logo from './Logo';
import NotificationCenter from './Dashboard/NotificationCenter';
import UserMenu from './Dashboard/UserMenu';
import { Button } from './ui';

const FuturisticHeader = ({
    title,
    tabs = [],
    actions,
    showSearch = true,
    showUserMenu = true,
    className = ''
}) => {
    return (
        <header className={`h-16 border-b border-white/5 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-40 transition-all duration-300 ${className}`}>
            <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
                {/* Left Section: Logo & Title */}
                <div className="flex items-center gap-4 min-w-fit">
                    <Link to="/dashboard" className="flex items-center gap-3 group">
                        <Logo showText={false} />
                        {typeof title === 'string' ? (
                            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 hidden md:block">
                                {title}
                            </h1>
                        ) : (
                            title
                        )}
                    </Link>

                    {/* Navigation Tabs */}
                    {tabs.length > 0 && (
                        <>
                            <div className="h-6 w-px bg-white/10 hidden md:block"></div>
                            <nav className="hidden md:flex items-center gap-1">
                                {tabs.map((tab) => (
                                    <Link
                                        key={tab.path}
                                        to={tab.path}
                                        className={`relative px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 group overflow-hidden ${location.pathname.startsWith(tab.path)
                                            ? 'text-primary'
                                            : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            {tab.icon && <tab.icon className="h-4 w-4" />}
                                            {tab.label}
                                        </span>
                                        {location.pathname.startsWith(tab.path) && (
                                            <div className="absolute inset-0 bg-primary/10 rounded-md animate-fade-in"></div>
                                        )}
                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"></div>
                                    </Link>
                                ))}
                            </nav>
                        </>
                    )}
                </div>

                {/* Center Section: Search */}
                {showSearch && (
                    <div className="flex-1 max-w-2xl mx-auto hidden md:block">
                        <GlobalSearch />
                    </div>
                )}

                {/* Right Section: Actions */}
                <div className="flex items-center gap-3 min-w-fit">
                    {actions}

                    <div className="h-6 w-px bg-white/10 mx-1"></div>

                    <NotificationCenter />

                    {showUserMenu && <UserMenu />}
                </div>
            </div>

            {/* Mobile Search (if needed, can be toggled) */}
            {/* <div className="md:hidden px-4 pb-4">
                <GlobalSearch />
            </div> */}
        </header>
    );
};

export default FuturisticHeader;
