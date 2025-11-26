import { Link } from 'react-router-dom';
import GlobalSearch from './GlobalSearch';
import NotificationCenter from './NotificationCenter';
import UserMenu from './UserMenu';
import QuickCreateButton from './QuickCreateButton';

const CommandBar = ({ onCreateWorkspace }) => {
    return (
        <header className="h-16 border-b border-slate-700 flex items-center justify-between px-6 glass sticky top-0 z-30">
            {/* Logo/Brand */}
            <Link
                to="/dashboard"
                className="flex items-center gap-2 group"
            >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-lg">S</span>
                </div>
                <h1 className="text-xl font-bold gradient-text-neon hidden md:block">
                    SyncSpace
                </h1>
            </Link>

            {/* Global Search - Center */}
            <GlobalSearch className="flex-1 max-w-2xl mx-8" />

            {/* Right Section */}
            <div className="flex items-center gap-4">
                <NotificationCenter />
                <UserMenu />
                <QuickCreateButton onCreateWorkspace={onCreateWorkspace} />
            </div>
        </header>
    );
};

export default CommandBar;
