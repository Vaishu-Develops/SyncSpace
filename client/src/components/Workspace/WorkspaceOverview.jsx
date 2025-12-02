import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { Plus, Briefcase, Clock, ArrowRight, MoreVertical } from 'lucide-react';
import { Button } from '../ui';

const WorkspaceOverview = () => {
    const { workspaceId } = useParams();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        fetchProjects();
        const handleClickOutside = () => setActiveDropdown(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [workspaceId]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const response = await axios.get(
                `/api/projects?workspaceId=${workspaceId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async () => {
        const name = prompt('Enter project name:');
        if (!name) return;
        const description = prompt('Enter description (optional):');

        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            await api.post('/api/projects', {
                name,
                description,
                workspaceId
            }, { headers: { Authorization: `Bearer ${token}` } });
            fetchProjects();
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project');
        }
    };

    const handleEditProject = async (project, e) => {
        e.preventDefault();
        e.stopPropagation();
        const name = prompt('Enter new project name:', project.name);
        if (!name) return;
        const description = prompt('Enter new description:', project.description);

        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            await api.put(`/api/projects/${project._id}`, {
                name,
                description
            }, { headers: { Authorization: `Bearer ${token}` } });
            fetchProjects();
        } catch (error) {
            console.error('Error updating project:', error);
            alert('Failed to update project');
        }
    };

    const handleDeleteProject = async (projectId, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this project? All tasks and docs will be lost.')) return;

        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold gradient-text-primary">Projects</h2>
                <Button variant="primary" onClick={handleCreateProject}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length === 0 ? (
                    <button className="card hover:border-primary cursor-pointer text-center p-8 group">
                        <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                            <Plus className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-gray-400 font-medium">Create your first project</p>
                    </button>
                ) : (
                    projects.map((project) => (
                        <div key={project._id} className="relative">
                            <Link
                                to={`/project/${project._id}`}
                                className="card hover:border-primary cursor-pointer block group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                            <Briefcase className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                                                {project.name}
                                            </h3>
                                            <p className="text-sm text-gray-400">{project.description || 'No description'}</p>
                                        </div>
                                    </div>

                                    {/* 3-Dot Menu Button - Inside Link but positioned */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setActiveDropdown(activeDropdown === project._id ? null : project._id);
                                        }}
                                        className="p-2 rounded-lg hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>Updated recently</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <ArrowRight className="h-4 w-4" />
                                        <span>{project.tasks?.length || 0} tasks</span>
                                    </div>
                                </div>
                            </Link>

                            {/* Dropdown Menu - Outside Link */}
                            {activeDropdown === project._id && (
                                <div className="absolute top-12 right-4 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden">
                                    <button
                                        onClick={(e) => {
                                            handleEditProject(project, e);
                                            setActiveDropdown(null);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                                    >
                                        Edit Project
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            handleDeleteProject(project._id, e);
                                            setActiveDropdown(null);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                    >
                                        Delete Project
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default WorkspaceOverview;
