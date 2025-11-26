import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EnhancedSidebar from '../components/Dashboard/EnhancedSidebar';
import { CheckCircle2, Circle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
            const { data } = await axios.get('http://localhost:5000/api/tasks/my-tasks', config);
            setTasks(data);
        } catch (error) {
            console.error('Error fetching my tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'done': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'in-progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'done': return <CheckCircle2 className="h-4 w-4" />;
            case 'in-progress': return <Clock className="h-4 w-4" />;
            case 'pending': return <AlertCircle className="h-4 w-4" />;
            default: return <Circle className="h-4 w-4" />;
        }
    };

    const groupedTasks = {
        'todo': tasks.filter(t => t.status === 'todo'),
        'in-progress': tasks.filter(t => t.status === 'in-progress'),
        'done': tasks.filter(t => t.status === 'done'),
    };

    return (
        <div className="flex h-screen bg-slate-900 text-white">
            <EnhancedSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-5xl mx-auto">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
                            <p className="text-gray-400">Track your assigned tasks across all projects</p>

                        </header>

                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
                                <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="h-8 w-8 text-gray-500" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                                <p className="text-gray-400">You have no tasks assigned to you right now.</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* In Progress Section */}
                                {groupedTasks['in-progress'].length > 0 && (
                                    <section>
                                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-400">
                                            <Clock className="h-5 w-5" />
                                            In Progress
                                            <span className="text-xs bg-blue-400/10 px-2 py-0.5 rounded-full border border-blue-400/20">
                                                {groupedTasks['in-progress'].length}
                                            </span>
                                        </h2>
                                        <div className="grid gap-3">
                                            {groupedTasks['in-progress'].map(task => (
                                                <TaskCard key={task._id} task={task} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* To Do Section */}
                                {groupedTasks['todo'].length > 0 && (
                                    <section>
                                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-300">
                                            <Circle className="h-5 w-5" />
                                            To Do
                                            <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full">
                                                {groupedTasks['todo'].length}
                                            </span>
                                        </h2>
                                        <div className="grid gap-3">
                                            {groupedTasks['todo'].map(task => (
                                                <TaskCard key={task._id} task={task} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Done Section */}
                                {groupedTasks['done'].length > 0 && (
                                    <section>
                                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-400">
                                            <CheckCircle2 className="h-5 w-5" />
                                            Completed
                                            <span className="text-xs bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
                                                {groupedTasks['done'].length}
                                            </span>
                                        </h2>
                                        <div className="grid gap-3 opacity-60 hover:opacity-100 transition-opacity">
                                            {groupedTasks['done'].map(task => (
                                                <TaskCard key={task._id} task={task} />
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

const TaskCard = ({ task }) => (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-primary/50 transition-all group flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className={`h-2 w-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' :
                task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
            <div>
                <h3 className="font-medium text-white group-hover:text-primary transition-colors">{task.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    {task.project && (
                        <span className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded">
                            {task.project.name}
                        </span>
                    )}
                    {task.workspace && (
                        <span className="flex items-center gap-1">
                            • {task.workspace.name}
                        </span>
                    )}
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4">
            {task.dueDate && (
                <div className="text-xs text-gray-400 bg-slate-900/50 px-2 py-1 rounded">
                    {new Date(task.dueDate).toLocaleDateString()}
                </div>
            )}
            <Link
                to={`/workspace/${task.workspace?._id}/board`}
                className="p-2 hover:bg-slate-700 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
                <ArrowRight className="h-4 w-4" />
            </Link>
        </div>
    </div>
);

export default TasksPage;
