import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Folder, FileText, CheckSquare, UserPlus } from 'lucide-react';

const QuickCreateButton = ({ onCreateWorkspace }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const createOptions = [
        {
            icon: Folder,
            label: 'Workspace',
            color: 'primary',
            action: () => onCreateWorkspace && onCreateWorkspace()
        },
        {
            icon: FileText,
            label: 'Project',
            color: 'secondary',
            action: () => setShowProjectModal(true)
        },
        {
            icon: CheckSquare,
            label: 'Task',
            color: 'accent',
            action: () => setShowTaskModal(true)
        },
        { divider: true },
        {
            icon: UserPlus,
            label: 'Invite Team Member',
            color: 'secondary',
            action: () => setShowInviteModal(true)
        }
    ];

    return (
        <>
            <div ref={dropdownRef} className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg text-white font-medium hover:opacity-90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                >
                    <Plus className="h-5 w-5" />
                    <span>New</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-56 glass border border-slate-700 rounded-lg shadow-2xl z-50 animate-slide-down">
                        <div className="p-2">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">
                                Create New...
                            </div>
                            {createOptions.map((option, index) => {
                                if (option.divider) {
                                    return <div key={index} className="my-2 border-t border-slate-700" />;
                                }

                                const colorClasses = {
                                    primary: 'text-primary bg-primary/10',
                                    secondary: 'text-secondary bg-secondary/10',
                                    accent: 'text-accent bg-accent/10',
                                    success: 'text-success bg-success/10',
                                    warning: 'text-warning bg-warning/10'
                                };

                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            option.action();
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-slate-700/50 rounded-lg transition-colors group"
                                    >
                                        <div className={`p-1.5 rounded ${colorClasses[option.color]}`}>
                                            <option.icon className="h-4 w-4" />
                                        </div>
                                        <span className="flex-1 text-left">{option.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Task Modal */}
            {showTaskModal && (
                <QuickTaskModal onClose={() => setShowTaskModal(false)} />
            )}

            {/* Quick Project Modal */}
            {showProjectModal && (
                <QuickProjectModal onClose={() => setShowProjectModal(false)} />
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <QuickInviteModal onClose={() => setShowInviteModal(false)} />
            )}
        </>
    );
};

// Quick Task Creation Modal
const QuickTaskModal = ({ onClose }) => {
    const [taskData, setTaskData] = useState({ title: '', priority: 'medium' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        alert('Please create tasks from within a workspace or project');
        onClose();
    };

    return createPortal(
        <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            onClick={onClose}
        >
            <div
                className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-white mb-4">Quick Create Task</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Task Title</label>
                        <input
                            type="text"
                            value={taskData.title}
                            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter task title..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                        <select
                            value={taskData.priority}
                            onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="flex-1 bg-primary hover:opacity-90 text-white px-4 py-2 rounded-lg transition-opacity font-medium">
                            Create Task
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

// Quick Project Creation Modal
const QuickProjectModal = ({ onClose }) => {
    const [projectData, setProjectData] = useState({ name: '', description: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        alert('Please create projects from within a workspace');
        onClose();
    };

    return createPortal(
        <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            onClick={onClose}
        >
            <div
                className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-white mb-4">Quick Create Project</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                        <input
                            type="text"
                            value={projectData.name}
                            onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter project name..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            value={projectData.description}
                            onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={3}
                            placeholder="Enter project description..."
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="flex-1 bg-primary hover:opacity-90 text-white px-4 py-2 rounded-lg transition-opacity font-medium">
                            Create Project
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

// Quick Invite Modal
const QuickInviteModal = ({ onClose }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        alert('Please invite team members from within a workspace or team page');
        onClose();
    };

    return createPortal(
        <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            onClick={onClose}
        >
            <div
                className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-white mb-4">Invite Team Member</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter email address..."
                            required
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="flex-1 bg-primary hover:opacity-90 text-white px-4 py-2 rounded-lg transition-opacity font-medium">
                            Send Invite
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default QuickCreateButton;
