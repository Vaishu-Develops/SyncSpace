import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FuturisticHeader from '../components/FuturisticHeader';
import { CheckCircle2, Circle, Clock, AlertCircle, ArrowRight, Calendar, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyTasks();
    }, []);

    const fetchMyTasks = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await api.get('/api/tasks/my-tasks');
            setTasks(data);
        } catch (error) {
            console.error('Error fetching my tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const groupedTasks = {
        'todo': tasks.filter(t => t.status === 'todo'),
        'in-progress': tasks.filter(t => t.status === 'in-progress'),
        'done': tasks.filter(t => t.status === 'done'),
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
            <FuturisticHeader title="My Tasks" />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                            Your Mission Control
                        </h1>
                        <p className="text-slate-400 text-lg">Track and manage your assigned tasks across all projects</p>
                    </motion.div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="relative">
                                <div className="h-12 w-12 rounded-full border-b-2 border-blue-500 animate-spin"></div>
                                <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-t-2 border-purple-500 animate-spin reverse-spin"></div>
                            </div>
                        </div>
                    ) : tasks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 border-dashed"
                        >
                            <div className="h-20 w-20 bg-slate-800/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/10">
                                <CheckCircle2 className="h-10 w-10 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white">All Caught Up!</h3>
                            <p className="text-slate-400 max-w-md mx-auto">
                                You have no pending tasks assigned to you. Enjoy your free time or pick up something new from the backlog.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-10"
                        >
                            {/* In Progress Section */}
                            {groupedTasks['in-progress'].length > 0 && (
                                <section>
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="p-2 bg-blue-500/10 rounded-lg">
                                            <Clock className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white">In Progress</h2>
                                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                                            {groupedTasks['in-progress'].length}
                                        </span>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {groupedTasks['in-progress'].map(task => (
                                            <motion.div key={task._id} variants={itemVariants}>
                                                <TaskCard task={task} statusColor="blue" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* To Do Section */}
                            {groupedTasks['todo'].length > 0 && (
                                <section>
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="p-2 bg-purple-500/10 rounded-lg">
                                            <Circle className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white">To Do</h2>
                                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
                                            {groupedTasks['todo'].length}
                                        </span>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {groupedTasks['todo'].map(task => (
                                            <motion.div key={task._id} variants={itemVariants}>
                                                <TaskCard task={task} statusColor="purple" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Done Section */}
                            {groupedTasks['done'].length > 0 && (
                                <section>
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="p-2 bg-green-500/10 rounded-lg">
                                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white">Completed</h2>
                                        <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                                            {groupedTasks['done'].length}
                                        </span>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 opacity-80 hover:opacity-100 transition-opacity">
                                        {groupedTasks['done'].map(task => (
                                            <motion.div key={task._id} variants={itemVariants}>
                                                <TaskCard task={task} statusColor="green" isCompleted />
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
};

const TaskCard = ({ task, statusColor, isCompleted = false }) => {
    const priorityColors = {
        high: 'bg-red-500 shadow-red-500/50',
        medium: 'bg-yellow-500 shadow-yellow-500/50',
        low: 'bg-green-500 shadow-green-500/50'
    };

    const colorClasses = {
        blue: 'group-hover:border-blue-500/50 group-hover:shadow-blue-500/20',
        purple: 'group-hover:border-purple-500/50 group-hover:shadow-purple-500/20',
        green: 'group-hover:border-green-500/50 group-hover:shadow-green-500/20',
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`
                relative bg-slate-800/40 backdrop-blur-md p-5 rounded-xl border border-slate-700/50 
                transition-all duration-300 group shadow-lg hover:shadow-xl
                ${colorClasses[statusColor]}
                ${isCompleted ? 'bg-slate-800/20' : ''}
            `}
        >
            <div className="flex justify-between items-start mb-3">
                <div className={`h-2.5 w-2.5 rounded-full shadow-sm ${priorityColors[task.priority] || 'bg-gray-500'}`}></div>
                {task.dueDate && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-900/50 px-2 py-1 rounded-md border border-slate-700/50">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                )}
            </div>

            <h3 className={`font-semibold text-lg mb-2 line-clamp-2 ${isCompleted ? 'text-slate-400 line-through' : 'text-white group-hover:text-white'}`}>
                {task.title}
            </h3>

            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-700/50">
                {task.project && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Briefcase className="h-3.5 w-3.5" />
                        <span className="truncate">{task.project.name}</span>
                    </div>
                )}
                {task.workspace && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="h-3.5 w-3.5 rounded bg-slate-700 flex items-center justify-center text-[10px]">W</div>
                        <span className="truncate">{task.workspace.name}</span>
                    </div>
                )}
            </div>

            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                <Link
                    to={`/workspace/${task.workspace?._id}/board`}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-sm transition-colors flex items-center justify-center"
                >
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </motion.div>
    );
};

export default TasksPage;
