import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
    const { user } = useAuth();
    const [pinnedWorkspaces, setPinnedWorkspaces] = useState([]);
    const [recentItems, setRecentItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchPinnedWorkspaces(),
                fetchRecentItems()
            ]);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPinnedWorkspaces = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await api.get('/api/workspaces');

            const pinned = data.filter(workspace =>
                workspace.pinnedBy && workspace.pinnedBy.includes(user._id)
            );
            setPinnedWorkspaces(pinned);
        } catch (error) {
            console.error('Error fetching pinned workspaces:', error);
        }
    };

    const fetchRecentItems = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Fetch tasks assigned to user
            const tasksRes = await api.get('/api/tasks/my-tasks');

            // Fetch projects (we'll filter for recent ones on frontend for now or update API later)
            // For now, let's just use tasks as "Recently Viewed" since they are most granular
            // We can add projects if needed, but tasks are usually what people work on

            const tasks = tasksRes.data.map(task => ({
                id: task._id,
                name: task.title,
                type: 'task',
                updatedAt: task.updatedAt,
                link: `/workspace/${task.workspace._id}/board?taskId=${task._id}` // Assuming we can deep link or just to board
            }));

            // Sort by updatedAt desc and take top 5
            const recent = tasks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);
            setRecentItems(recent);
        } catch (error) {
            console.error('Error fetching recent items:', error);
        }
    };

    const togglePin = async (workspaceId) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.put(`/api/workspaces/${workspaceId}/pin`);

            // Refresh pinned workspaces immediately
            await fetchPinnedWorkspaces();
            return true;
        } catch (error) {
            console.error('Error toggling pin:', error);
            return false;
        }
    };

    const value = {
        pinnedWorkspaces,
        recentItems,
        loading,
        fetchDashboardData,
        togglePin
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};
