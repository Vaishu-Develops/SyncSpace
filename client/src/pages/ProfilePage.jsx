import { useState, useEffect } from 'react';
import { User, Mail, Camera, Save, X } from 'lucide-react';
import api from '../utils/api';
import FuturisticHeader from '../components/FuturisticHeader';
import { Button } from '../components/ui';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
    const { user, setUser, refreshUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        workspaces: 0,
        tasksCompleted: 0
    });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        avatar: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                avatar: user.avatar || ''
            });
            fetchAccountStats();
        }
    }, [user]);

    // Refresh user data on component mount to ensure latest profile info
    useEffect(() => {
        if (user && refreshUser) {
            refreshUser().catch(console.error);
        }
    }, []);

    const fetchAccountStats = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Fetch workspaces count
            const workspacesRes = await api.get('/api/workspaces');

            // Fetch tasks and count completed ones
            const tasksRes = await api.get('/api/tasks/my-tasks');
            const completedTasks = tasksRes.data.filter(task => task.status === 'done').length;

            setStats({
                workspaces: workspacesRes.data.length,
                tasksCompleted: completedTasks
            });
        } catch (error) {
            console.error('Error fetching account stats:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create FormData object to handle file upload
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('bio', formData.bio);
            if (formData.avatarFile) {
                data.append('avatar', formData.avatarFile);
            }

            const { data: updatedData } = await api.put(
                '/api/auth/profile',
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Refresh user data from server to get the latest information
            await refreshUser();
            setIsEditing(false);

            // Update local state to show new avatar immediately
            setFormData(prev => ({
                ...prev,
                avatar: updatedData.avatar,
                avatarFile: null
            }));
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                avatarFile: file,
                // Create a temporary preview URL
                avatarPreview: URL.createObjectURL(file)
            });
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
            {/* Futuristic Header */}
            <FuturisticHeader
                title="My Profile"
                actions={!isEditing && (
                    <Button
                        variant="primary"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </Button>
                )}
            />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="card">
                        {/* Profile Header */}
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                            <div className="relative group">
                                <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    {formData.avatarPreview || user?.avatar ? (
                                        <img
                                            src={formData.avatarPreview || user.avatar}
                                            alt={user?.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white">
                                            {getInitials(formData.name)}
                                        </div>
                                    )}
                                </div>
                                {isEditing && (
                                    <>
                                        <input
                                            type="file"
                                            id="avatar-upload"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <label
                                            htmlFor="avatar-upload"
                                            className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                                        >
                                            <Camera className="h-4 w-4 text-white" />
                                        </label>
                                    </>
                                )}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
                                <p className="text-slate-500 dark:text-gray-400">{user?.email}</p>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    rows={4}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            {isEditing && (
                                <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        icon={<Save className="h-4 w-4" />}
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        icon={<X className="h-4 w-4" />}
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                name: user?.name || '',
                                                email: user?.email || '',
                                                bio: user?.bio || '',
                                                avatar: user?.avatar || ''
                                            });
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </form>

                        {/* Account Stats */}
                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-semibold mb-4">Account Statistics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4">
                                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Member Since</p>
                                    <p className="text-lg font-semibold">
                                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4">
                                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Workspaces</p>
                                    <p className="text-lg font-semibold">{stats.workspaces}</p>
                                </div>
                                <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4">
                                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Tasks Completed</p>
                                    <p className="text-lg font-semibold">{stats.tasksCompleted}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
