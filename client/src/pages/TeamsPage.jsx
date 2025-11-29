import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Settings, Trash2, UserPlus } from 'lucide-react';
import axios from 'axios';
import ManageTeamModal from '../components/Dashboard/ManageTeamModal';

const TeamsPage = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [managingTeam, setManagingTeam] = useState(null);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.get('http://localhost:5000/api/teams', config);
            setTeams(data);
        } catch (error) {
            console.error('Error fetching teams:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeam = async (teamData) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.post('http://localhost:5000/api/teams', teamData, config);
            fetchTeams();
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error creating team:', error);
        }
    };

    const handleDeleteTeam = async (teamId) => {
        if (!window.confirm('Are you sure you want to delete this team?')) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.delete(`http://localhost:5000/api/teams/${teamId}`, config);
            fetchTeams();
        } catch (error) {
            console.error('Error deleting team:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Teams</h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateModal(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Create Team
                </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                    <motion.div
                        key={team._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-white">{team.name}</h3>
                                <p className="text-slate-400 mt-1">{team.description}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setManagingTeam(team)}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded"
                                >
                                    <Settings className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteTeam(team._id)}
                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Users className="h-4 w-4" />
                                <span>{team.members?.length || 0} members</span>
                            </div>
                            <button
                                onClick={() => setManagingTeam(team)}
                                className="text-primary hover:text-primary-light flex items-center gap-1 text-sm"
                            >
                                <UserPlus className="h-4 w-4" />
                                Manage
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {teams.length === 0 && (
                <div className="text-center py-12">
                    <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No teams yet</h3>
                    <p className="text-slate-400 mb-4">Create your first team to start collaborating</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Create Team
                    </button>
                </div>
            )}

            {/* Create Team Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-800 rounded-lg p-6 w-full max-w-md"
                        >
                            <h2 className="text-xl font-bold text-white mb-4">Create New Team</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    handleCreateTeam({
                                        name: formData.get('name'),
                                        description: formData.get('description'),
                                    });
                                }}
                            >
                                <div className="mb-4">
                                    <label className="block text-slate-300 mb-2">Team Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-slate-300 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 px-4 py-2 text-slate-300 bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
