const Message = require('../models/Message');

// Get messages for a workspace or project
const getMessages = async (req, res) => {
    const { workspaceId, projectId } = req.query;
    const { limit = 50, before } = req.query;

    try {
        const query = {};

        if (projectId) {
            query.project = projectId;
        } else if (workspaceId) {
            query.workspace = workspaceId;
        } else {
            return res.status(400).json({ message: 'workspaceId or projectId required' });
        }

        // Pagination support
        if (before) {
            query.createdAt = { $lt: new Date(before) };
        }

        const messages = await Message.find(query)
            .populate('sender', 'name avatar email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json(messages.reverse()); // Return in chronological order
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new message
const createMessage = async (req, res) => {
    const { content, workspaceId, projectId, attachments } = req.body;

    try {
        const message = await Message.create({
            content,
            sender: req.user._id,
            workspace: workspaceId,
            project: projectId || null,
            attachments: attachments || []
        });

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'name avatar email');

        // Emit socket event (handled in socket middleware)
        if (req.io) {
            const room = projectId || workspaceId;
            req.io.to(room).emit('message-received', populatedMessage);
        }

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a message
const updateMessage = async (req, res) => {
    const { messageId } = req.params;
    const { content } = req.body;

    try {
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Check if user is the sender
        if (message.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to edit this message' });
        }

        message.content = content;
        message.isEdited = true;
        message.editedAt = new Date();
        await message.save();

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'name avatar email');

        // Emit socket event
        if (req.io) {
            const room = message.project || message.workspace;
            req.io.to(room).emit('message-updated', populatedMessage);
        }

        res.json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a message
const deleteMessage = async (req, res) => {
    const { messageId } = req.params;

    try {
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Check if user is the sender
        if (message.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this message' });
        }

        await message.deleteOne();

        // Emit socket event
        if (req.io) {
            const room = message.project || message.workspace;
            req.io.to(room).emit('message-deleted', { messageId });
        }

        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark message as read
const markAsRead = async (req, res) => {
    const { messageId } = req.params;

    try {
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Check if already read by this user
        const alreadyRead = message.readBy.some(
            r => r.user.toString() === req.user._id.toString()
        );

        if (!alreadyRead) {
            message.readBy.push({
                user: req.user._id,
                readAt: new Date()
            });
            await message.save();
        }

        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMessages,
    createMessage,
    updateMessage,
    deleteMessage,
    markAsRead
};
