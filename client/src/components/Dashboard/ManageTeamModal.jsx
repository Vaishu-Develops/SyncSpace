import { useState } from 'react';
import api from '../../utils/api';
import { X, UserPlus, Trash2, Shield } from 'lucide-react';
import { Button, Input, Avatar } from '../ui';

const ManageTeamModal = ({ isOpen, onClose, team, onUpdate }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen || !team) return null;

    const handleAddMember = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post(
                `/api/teams/${team._id}/members`,
                { email }
            );

            setEmail('');
            onUpdate(); // Refresh team data
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add member');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md glass border border-slate-700 rounded-xl shadow-2xl animate-scale-in">
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Manage Team: {team.name}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Add Member Form */}
                    <form onSubmit={handleAddMember} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Add Member by Email
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="colleague@example.com"
                                    required
                                    className="flex-1"
                                />
                                <Button
                                    type="submit"
                                    variant="primary"
                                    loading={loading}
                                    icon={<UserPlus className="h-4 w-4" />}
                                >
                                    Add
                                </Button>
                            </div>
                            {error && (
                                <p className="text-danger text-sm mt-2">{error}</p>
                            )}
                        </div>
                    </form>

                    {/* Members List */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-3">Current Members</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {team.members?.map((member) => (
                                <div key={member._id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
                                            {member.user?.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{member.user?.name}</p>
                                            <p className="text-xs text-gray-400">{member.user?.email}</p>
                                        </div>
                                    </div>
                                    {member.role === 'admin' && (
                                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs flex items-center gap-1">
                                            <Shield className="h-3 w-3" />
                                            Admin
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageTeamModal;
