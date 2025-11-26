import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, Mail, Shield, MoreVertical } from 'lucide-react';
import { Button, Input, Avatar } from '../components/ui';
import EnhancedSidebar from '../components/Dashboard/EnhancedSidebar';
import CommandBar from '../components/Dashboard/CommandBar';

import ManageTeamModal from '../components/Dashboard/ManageTeamModal';

const TeamsPage = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');

    // New state for managing team
    const [managingTeam, setManagingTeam] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        fetchTeams();
        const handleClickOutside = () => setActiveDropdown(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchTeams = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const { data } = await axios.get('http://localhost:5000/api/teams', config);
            setTeams(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching teams:', error);
            setLoading(false);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            await axios.post('http://localhost:5000/api/teams', { name: newTeamName }, config);
            setNewTeamName('');
            setIsCreateModalOpen(false);
            fetchTeams();
        } catch (error) {
            console.error('Error creating team:', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <CommandBar />

            <div className="flex flex-1 overflow-hidden">
                <EnhancedSidebar />

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Teams</h1>
                                <p className="text-gray-400">Manage your teams and members</p>
                            </div>
                            <Button
                                variant="primary"
                                icon={<Plus className="h-4 w-4" />}
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                Create Team
                            </Button>
                        </div>

                        {loading ? (
                            <div className="text-center py-12 text-gray-400">Loading teams...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {teams.map((team) => (
                                    <div key={team._id} className="glass border border-slate-700 rounded-xl p-6 hover:border-primary/50 transition-all group relative">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center text-violet-400">
                                                <Users className="h-6 w-6" />
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveDropdown(activeDropdown === team._id ? null : team._id);
                                                }}
                                                className="text-gray-400 hover:text-white p-1 rounded hover:bg-slate-700"
                                            >
                                                <MoreVertical className="h-5 w-5" />
                                            </button>

                                            {/* Dropdown */}
                                            {activeDropdown === team._id && (
                                                <div className="absolute top-14 right-6 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 animate-scale-in overflow-hidden">
                                                    <button
                                                        onClick={() => {
                                                            setManagingTeam(team);
                                                            setActiveDropdown(null);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
                                                    >
                                                        Manage Members
                                                    </button>
                                                    {/* Add Delete option later if needed */}
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-semibold text-white mb-2">{team.name}</h3>

                                        <div className="space-y-4 mt-6">
                                            <div className="flex items-center justify-between text-sm text-gray-400">
                                                <span>Members</span>
                                                <span className="text-white font-medium">{team.members?.length || 0}</span>
                                            </div>

                                            <div className="flex -space-x-2 overflow-hidden py-2">
                                                {team.members?.slice(0, 5).map((member, i) => (
                                                    <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-700 flex items-center justify-center text-xs font-medium text-white">
                                                        {member.user?.name?.[0] || 'U'}
                                                    </div>
                                                ))}
                                                {(team.members?.length || 0) > 5 && (
                                                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-800 flex items-center justify-center text-xs font-medium text-gray-400">
                                                        +{team.members.length - 5}
                                                    </div>
                                                )}
                                            </div>

                                            <Button
                                                variant="outline"
                                                className="w-full mt-4"
                                                onClick={() => setManagingTeam(team)}
                                            >
                                                Manage Team
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Create Team Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-md glass border border-slate-700 rounded-xl shadow-2xl p-6 animate-scale-in">
                        <h2 className="text-xl font-bold text-white mb-6">Create New Team</h2>
                        <form onSubmit={handleCreateTeam} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Team Name</label>
                                <Input
                                    value={newTeamName}
                                    onChange={(e) => setNewTeamName(e.target.value)}
                                    placeholder="e.g., Engineering"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary">
                                    Create Team
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Manage Team Modal */}
            <ManageTeamModal
                isOpen={!!managingTeam}
                onClose={() => setManagingTeam(null)}
                team={managingTeam}
                onUpdate={fetchTeams}
            />
        </div>
    );
};

export default TeamsPage;
