import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Save, Trash2, AlertTriangle, Check, X } from 'lucide-react';
import { Button, Input } from '../components/ui';

const WorkspaceSettings = () => {
    const { workspaceId } = useParams();
    const navigate = useNavigate();
    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        fetchWorkspace();
    }, [workspaceId]);

    const fetchWorkspace = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await api.get(`/api/workspaces/${workspaceId}`);
            setWorkspace(data);
            setFormData({
                name: data.name,
                description: data.description || ''
            });
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch workspace');
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.put(
                `/api/workspaces/${workspaceId}`,
                formData,
                config
            );
            setWorkspace(data);
            setIsEditing(false);
            // Show success message or toast
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update workspace');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
            return;
        }

        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await api.delete(`/api/workspaces/${workspaceId}`);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete workspace');
        }
    };

    if (loading) return <div className="text-white p-8">Loading...</div>;
    if (error) return <div className="text-danger p-8">{error}</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto text-white">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold gradient-text-neon">Workspace Settings</h1>
                {!isEditing && (
                    <Button variant="danger" onClick={handleDelete} icon={<Trash2 className="h-4 w-4" />}>
                        Delete Workspace
                    </Button>
                )}
            </div>

            <div className="glass p-8 rounded-xl border border-slate-700">
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Workspace Name
                        </label>
                        {isEditing ? (
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter workspace name"
                                required
                            />
                        ) : (
                            <div className="text-xl font-semibold text-white">{workspace.name}</div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Description
                        </label>
                        {isEditing ? (
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500 min-h-[100px]"
                                placeholder="Enter workspace description"
                            />
                        ) : (
                            <div className="text-gray-300">{workspace.description || 'No description provided.'}</div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-700">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Team
                            </label>
                            <div className="text-white">{workspace.team?.name}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Created By
                            </label>
                            <div className="text-white">{workspace.createdBy?.name}</div>
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end gap-4">
                        {isEditing ? (
                            <>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            name: workspace.name,
                                            description: workspace.description || ''
                                        });
                                    }}
                                    icon={<X className="h-4 w-4" />}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    icon={<Save className="h-4 w-4" />}
                                >
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Details
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WorkspaceSettings;
