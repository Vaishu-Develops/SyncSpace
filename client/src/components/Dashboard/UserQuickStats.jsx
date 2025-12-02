import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui';
import { Zap, Briefcase } from 'lucide-react';
import axios from 'axios';

const UserQuickStats = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        tasksToday: 0,
        activeProjects: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
                if (!token) return;

                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const [tasksRes, projectsRes] = await Promise.all([
                    api.get('/api/tasks/my-tasks'),
                    axios.get('http://localhost:5000/api/projects', config)
                ]);

                // Calculate tasks due today
                const today = new Date().toDateString();
                const tasksTodayCount = tasksRes.data.filter(task => {
                    if (!task.dueDate) return false;
                    return new Date(task.dueDate).toDateString() === today;
                }).length;

                // Calculate active projects (where user is member or creator)
                // Note: The backend might return all projects, so we filter client-side to be safe
                // and also check for 'active' status if applicable (assuming all returned are active for now)
                const activeProjectsCount = projectsRes.data.filter(project => {
                    const isMember = project.members.some(m => m._id === user?._id || m === user?._id);
                    const isCreator = project.createdBy?._id === user?._id || project.createdBy === user?._id;
                    return isMember || isCreator;
                }).length;

                setStats({
                    tasksToday: tasksTodayCount,
                    activeProjects: activeProjectsCount
                });

            } catch (error) {
                console.error('Error fetching user stats:', error);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    return (
        <div className="p-4 border-b border-slate-700">
            <div className="flex items-center gap-3 mb-3">
                <Avatar name={user?.name} src={user?.avatar} size="lg" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">Online</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-gray-300">{stats.tasksToday} tasks today</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-secondary" />
                    <span className="text-gray-300">{stats.activeProjects} active projects</span>
                </div>
            </div>
        </div>
    );
};

export default UserQuickStats;
