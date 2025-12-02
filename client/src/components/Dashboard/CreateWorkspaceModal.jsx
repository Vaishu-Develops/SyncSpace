import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { X, Save, Folder, Users } from 'lucide-react';
import { Button, Input } from '../ui';

const CreateWorkspaceModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        teamId: ''
    });
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchTeams();
            if (initialData) {
                setFormData({
                    name: initialData.name,
                    description: initialData.description,
                    teamId: initialData.team?._id || initialData.team // Handle populated or ID
                });
            } else {
                setFormData({ name: '', description: '', teamId: '' });
            }
            setError('');
        }
    }, [isOpen, initialData]);

    const fetchTeams = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const { data } = await axios.get('http://localhost:5000/api/teams', config);
            setTeams(data);
            // Only set default team if not editing and no team selected
            if (!initialData && data.length > 0 && !formData.teamId) {
                setFormData(prev => ({ ...prev, teamId: data[0]._id }));
            }
        } catch (err) {
            setError('Failed to load teams');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            if (initialData) {
                await axios.put(
                    `http://localhost:5000/api/workspaces/${initialData._id}`,
                    formData,
                    config
                );
            } else {
                await axios.post(
                    'http://localhost:5000/api/workspaces',
                    formData,
                    config
                );
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${initialData ? 'update' : 'create'} workspace`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md glass border border-slate-700 rounded-xl shadow-2xl animate-scale-in">
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Folder className="h-5 w-5 text-primary" />
                        {initialData ? 'Edit Workspace' : 'Create Workspace'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Workspace Name
                        </label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Marketing Campaign Q1"
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500 min-h-[100px]"
                            placeholder="What is this workspace for?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Team
                        </label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                                value={formData.teamId}
                                onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white appearance-none cursor-pointer"
                                required
                            >
                                <option value="" disabled>Select a team</option>
                                {teams.map(team => (
                                    <option key={team._id} value={team._id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {teams.length === 0 && (
                            <p className="text-xs text-warning mt-1">
                                You need to be part of a team to create a workspace.
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            disabled={teams.length === 0}
                            icon={<Save className="h-4 w-4" />}
                        >
                            {initialData ? 'Save Changes' : 'Create Workspace'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateWorkspaceModal;
