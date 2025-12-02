import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Users, Plus, Mail, Shield, MoreVertical, Search, Sparkles } from 'lucide-react';
import { Button, Input, Avatar, AvatarGroup } from '../components/ui';
import FuturisticHeader from '../components/FuturisticHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import { API_ENDPOINTS } from '../config/api';
import ManageTeamModal from '../components/Dashboard/ManageTeamModal';

const TeamsPage = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');

    // New state for managing team
    const [managingTeam, setManagingTeam] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const socket = useSocket();

    useEffect(() => {
        fetchTeams();
        const handleClickOutside = () => setActiveDropdown(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleTeamUpdated = (updatedTeam) => {
            setTeams(prevTeams => prevTeams.map(team =>
                team._id === updatedTeam._id ? updatedTeam : team
            ));
        };

        const handleTeamCreated = (newTeam) => {
            setTeams(prevTeams => [...prevTeams, newTeam]);
        };

        socket.on('team-updated', handleTeamUpdated);
        socket.on('team-created', handleTeamCreated);

        return () => {
            socket.off('team-updated', handleTeamUpdated);
            socket.off('team-created', handleTeamCreated);
        };
    }, [socket]);

    const fetchTeams = async () => {
        try {
            const { data } = await api.get('/api/teams');
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
            await api.post('/api/teams', { name: newTeamName });
            setNewTeamName('');
            setIsCreateModalOpen(false);
            // fetchTeams(); // Handled by socket now
        } catch (error) {
            console.error('Error creating team:', error);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
            <FuturisticHeader
                title="Teams"
                actions={
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="primary"
                            icon={<Plus className="h-4 w-4" />}
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-none shadow-lg shadow-blue-500/20"
                        >
                            Create Team
                        </Button>
                    </motion.div>
                }
            />

            <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
                    >
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                                Your Squads
                            </h1>
                            <p className="text-slate-400 text-lg">Manage your teams and collaborate efficiently</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsCreateModalOpen(true)}
                            className="md:hidden flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl shadow-lg"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Create Team</span>
                        </motion.button>
                    </motion.div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="relative">
                                <div className="h-12 w-12 rounded-full border-b-2 border-blue-500 animate-spin"></div>
                                <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-t-2 border-purple-500 animate-spin reverse-spin"></div>
                            </div>
                        </div>
                    ) : teams.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 border-dashed"
                        >
                            <div className="h-20 w-20 bg-slate-800/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/10">
                                <Users className="h-10 w-10 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white">No Teams Yet</h3>
                            <p className="text-slate-400 max-w-md mx-auto mb-8">
                                Create your first team to start collaborating with others on projects and tasks.
                            </p>
                            <Button
                                variant="primary"
                                icon={<Plus className="h-4 w-4" />}
                                onClick={() => setIsCreateModalOpen(true)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 border-none"
                            >
                                Create Team
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {teams.map((team) => (
                                <motion.div
                                    key={team._id}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className="group relative bg-slate-800/40 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 group-hover:text-purple-400 transition-colors shadow-inner shadow-white/5">
                                                <Users className="h-6 w-6" />
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveDropdown(activeDropdown === team._id ? null : team._id);
                                                }}
                                                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                                            >
                                                <MoreVertical className="h-5 w-5" />
                                            </button>

                                            {/* Dropdown */}
                                            <AnimatePresence>
                                                {activeDropdown === team._id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        className="absolute top-12 right-0 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden backdrop-blur-xl"
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                setManagingTeam(team);
                                                                setActiveDropdown(null);
                                                            }}
                                                            className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                                                        >
                                                            <Users className="h-4 w-4" />
                                                            Manage Members
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                                            {team.name}
                                        </h3>

                                        <div className="space-y-4 mt-6">
                                            <div className="flex items-center justify-between text-sm text-slate-400">
                                                <span className="flex items-center gap-2">
                                                    <Shield className="h-3 w-3" />
                                                    Members
                                                </span>
                                                <span className="font-bold text-white bg-slate-700/50 px-2 py-0.5 rounded-md border border-slate-600/50">
                                                    {team.members?.length || 0}
                                                </span>
                                            </div>

                                            <div className="py-2 pl-1">
                                                <AvatarGroup
                                                    avatars={team.members?.map(member => ({
                                                        src: member.user?.avatar,
                                                        name: member.user?.name,
                                                        alt: member.user?.name
                                                    })) || []}
                                                    max={5}
                                                    size="sm"
                                                />
                                            </div>

                                            <Button
                                                variant="outline"
                                                className="w-full mt-4 border-slate-600/50 hover:bg-white/5 hover:border-purple-500/50 hover:text-purple-400 transition-all"
                                                onClick={() => setManagingTeam(team)}
                                            >
                                                Manage Team
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </main>

            {/* Create Team Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md bg-slate-900/90 border border-slate-700/50 rounded-2xl shadow-2xl p-6 backdrop-blur-xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                                    <Sparkles className="h-6 w-6 text-purple-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Create New Team</h2>
                            </div>

                            <form onSubmit={handleCreateTeam} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Team Name</label>
                                    <Input
                                        value={newTeamName}
                                        onChange={(e) => setNewTeamName(e.target.value)}
                                        placeholder="e.g., Engineering Squad"
                                        required
                                        autoFocus
                                        className="bg-slate-800/50 border-slate-700 focus:border-purple-500 focus:ring-purple-500/20"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="hover:bg-white/5 text-slate-400 hover:text-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:shadow-lg hover:shadow-purple-500/20"
                                    >
                                        Create Team
                                    </Button>
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
