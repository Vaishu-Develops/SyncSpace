const Project = require('../models/Project');
const Task = require('../models/Task');
const Document = require('../models/Document');

const createProject = async (req, res) => {
    const { name, description, workspaceId, startDate, dueDate, members } = req.body;

    try {
        const project = await Project.create({
            name,
            description,
            workspace: workspaceId,
            startDate,
            dueDate,
            members: members || [], // IDs of users
            createdBy: req.user._id
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProjects = async (req, res) => {
    // Support both params (if route is /workspaces/:workspaceId/projects) and query (if route is /projects?workspaceId=...)
    const workspaceId = req.params.workspaceId || req.query.workspaceId;

    try {
        const query = {};
        if (workspaceId) {
            query.workspace = workspaceId;
        }

        const projects = await Project.find(query)
            .populate('members', 'name avatar email')
            .populate('createdBy', 'name')
            .populate('workspace', 'name');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProject = async (req, res) => {
    const { projectId } = req.params;
    try {
        const project = await Project.findById(projectId)
            .populate('members', 'name avatar email')
            .populate('workspace', 'name');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProject = async (req, res) => {
    const { projectId } = req.params;
    try {
        const project = await Project.findByIdAndUpdate(projectId, req.body, { new: true });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProject = async (req, res) => {
    const { projectId } = req.params;
    try {
        await Project.findByIdAndDelete(projectId);
        // Optionally delete associated tasks and docs
        await Task.deleteMany({ project: projectId });
        await Document.deleteMany({ project: projectId });

        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject };
