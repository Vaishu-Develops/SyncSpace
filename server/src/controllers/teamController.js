const Team = require('../models/Team');
const User = require('../models/User');

const createTeam = async (req, res) => {
    const { name } = req.body;

    try {
        const team = await Team.create({
            name,
            members: [{ user: req.user._id, role: 'admin' }],
            createdBy: req.user._id,
        });

        // Populate creator for frontend
        const populatedTeam = await Team.findById(team._id)
            .populate('members.user', 'name email avatar')
            .populate('createdBy', 'name');

        req.io.to(req.user._id.toString()).emit('team-created', populatedTeam);

        res.status(201).json(populatedTeam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTeams = async (req, res) => {
    try {
        const teams = await Team.find({ 'members.user': req.user._id })
            .populate('members.user', 'name email avatar')
            .populate('createdBy', 'name');
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addMember = async (req, res) => {
    const { teamId } = req.params;
    const { email } = req.body;

    try {
        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check if requester is admin
        const requester = team.members.find(member => member.user.toString() === req.user._id.toString());
        if (!requester || requester.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to add members' });
        }

        // Case-insensitive search
        const userToAdd = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
        if (!userToAdd) {
            return res.status(404).json({ message: `User with email ${email} not found. They must register first.` });
        }

        if (team.members.some(member => member.user.toString() === userToAdd._id.toString())) {
            return res.status(400).json({ message: 'User already in team' });
        }

        team.members.push({ user: userToAdd._id, role: 'member' });
        await team.save();

        const populatedTeam = await Team.findById(team._id)
            .populate('members.user', 'name email avatar')
            .populate('createdBy', 'name');

        // Notify all members
        populatedTeam.members.forEach(member => {
            req.io.to(member.user._id.toString()).emit('team-updated', populatedTeam);
        });

        // Also notify the new member specifically that they've been added to a team (so it appears in their list)
        req.io.to(userToAdd._id.toString()).emit('team-created', populatedTeam);

        res.json(populatedTeam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createTeam, getTeams, addMember };
