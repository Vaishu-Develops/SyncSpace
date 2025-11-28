import { Outlet } from 'react-router-dom';
import EnhancedSidebar from './Dashboard/EnhancedSidebar';

const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
            <EnhancedSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto flex flex-col">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
