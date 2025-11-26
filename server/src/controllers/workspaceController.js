const Workspace = require('../models/Workspace');
const Team = require('../models/Team');

const createWorkspace = async (req, res) => {
    const { name, description, teamId } = req.body;

    try {
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check if user is a member of the team
        if (!team.members.some(member => member.user.toString() === req.user._id.toString())) {
            return res.status(403).json({ message: 'Not authorized to create workspace in this team' });
        }

        const workspace = await Workspace.create({
            name,
            description,
            team: teamId,
            createdBy: req.user._id,
        });

        res.status(201).json(workspace);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getWorkspaces = async (req, res) => {
    const { teamId } = req.query;

    try {
        let query = {};
        if (teamId) {
            query.team = teamId;
            // Verify user is in the team
            const team = await Team.findById(teamId);
            if (!team || !team.members.some(member => member.user.toString() === req.user._id.toString())) {
                return res.status(403).json({ message: 'Not authorized to view workspaces for this team' });
            }
        } else {
            // Find all workspaces for teams the user is in
            const teams = await Team.find({ 'members.user': req.user._id });
            const teamIds = teams.map(t => t._id);
            query.team = { $in: teamIds };
        }

        const workspaces = await Workspace.find(query)
            .populate('team', 'name')
            .populate('createdBy', 'name');

        res.json(workspaces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getWorkspaceById = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id)
            .populate('team', 'name members')
            .populate('createdBy', 'name email');

        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        // Verify user is in the team
        const team = await Team.findById(workspace.team._id);
        if (!team || !team.members.some(member => member.user.toString() === req.user._id.toString())) {
            return res.status(403).json({ message: 'Not authorized to view this workspace' });
        }

        res.json(workspace);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateWorkspace = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id);

        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        // Verify user is in the team
        const team = await Team.findById(workspace.team);
        if (!team || !team.members.some(member => member.user.toString() === req.user._id.toString())) {
            return res.status(403).json({ message: 'Not authorized to update this workspace' });
        }

        workspace.name = req.body.name || workspace.name;
        workspace.description = req.body.description || workspace.description;

        const updatedWorkspace = await workspace.save();
        res.json(updatedWorkspace);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteWorkspace = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id);

        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        // Verify user is in the team and maybe check if they are admin/creator? 
        // For now, just check team membership for simplicity, or strictly creator.
        // Let's stick to team membership + creator check for safety.
        if (workspace.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this workspace' });
        }

        await workspace.deleteOne();
        res.json({ message: 'Workspace removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getWorkspaceMembers = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id).populate({
            path: 'team',
            populate: {
                path: 'members.user',
                select: 'name email avatar'
            }
        });

        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        // Verify user is in the team
        const team = workspace.team;
        if (!team || !team.members.some(member => member.user._id.toString() === req.user._id.toString())) {
            return res.status(403).json({ message: 'Not authorized to view members of this workspace' });
        }

        // Extract users from team members
        const members = team.members.map(member => member.user);
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createWorkspace, getWorkspaces, getWorkspaceById, updateWorkspace, deleteWorkspace, getWorkspaceMembers };
