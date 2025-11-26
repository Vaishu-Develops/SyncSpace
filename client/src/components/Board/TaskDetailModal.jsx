import React, { useState, useEffect } from 'react';
import { X, User, Calendar, Tag, Flag, CheckSquare, AlignLeft, Clock } from 'lucide-react';
import axios from 'axios';
import Button from '../ui/Button';


const TaskDetailModal = ({ task, isOpen, onClose, onUpdate, workspaceId }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [status, setStatus] = useState(task.status);
    const [priority, setPriority] = useState(task.priority || 'medium');
    const [assignee, setAssignee] = useState(task.assignee?._id || '');
    const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchMembers();
            setTitle(task.title);
            setDescription(task.description || '');
            setStatus(task.status);
            setPriority(task.priority || 'medium');
            setAssignee(task.assignee?._id || '');
            setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
        }
    }, [isOpen, task]);

    const fetchMembers = async () => {
        try {
            console.log('Fetching members for workspace:', workspaceId);
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const { data } = await axios.get(`http://localhost:5000/api/workspaces/${workspaceId}/members`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Members fetched:', data);
            setMembers(data);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const { data } = await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
                title,
                description,
                status,
                priority,
                assignee: assignee || null,
                dueDate
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onUpdate(data);
            onClose();
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    console.log('Rendering TaskDetailModal with members:', members);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
                    <div className="flex items-center gap-3">
                        <CheckSquare className="h-5 w-5 text-primary" />
                        <span className="text-white font-medium">Edit Task</span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-transparent text-2xl font-bold text-white focus:outline-none focus:ring-0 border-none p-0 placeholder-gray-600"
                                placeholder="Task Title"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-400">
                                <AlignLeft className="h-4 w-4" />
                                <span className="text-sm font-medium">Description</span>
                            </div>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary min-h-[150px] resize-y"
                                placeholder="Add a more detailed description..."
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                            >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="pending">Pending</option>
                                <option value="done">Done</option>
                            </select>
                        </div>

                        {/* Assignee */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Assignee</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <select
                                    value={assignee}
                                    onChange={(e) => setAssignee(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                                >
                                    <option value="">Unassigned</option>
                                    {members.map(member => (
                                        <option key={member._id} value={member._id}>
                                            {member.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Priority</label>
                            <div className="relative">
                                <Flag className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Due Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 border-t border-slate-800">
                            <Button
                                variant="primary"
                                className="w-full justify-center"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
