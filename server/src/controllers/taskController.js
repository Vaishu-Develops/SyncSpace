const Task = require('../models/Task');
const Workspace = require('../models/Workspace');

const getTasks = async (req, res) => {
    const { workspaceId } = req.params;
    const { projectId } = req.query;

    try {
        const query = { workspace: workspaceId };
        if (projectId) {
            query.project = projectId;
        }

        const tasks = await Task.find(query)
            .populate('assignee', 'name avatar')
            .sort({ position: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyTasks = async (req, res) => {
    try {
        console.log('Fetching tasks for user:', req.user._id, req.user.name);
        const tasks = await Task.find({ assignee: req.user._id })
            .populate('project', 'name')
            .populate('workspace', 'name')
            .populate('assignee', 'name avatar')
            .sort({ updatedAt: -1 });
        console.log(`Found ${tasks.length} tasks for user ${req.user.name}`);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTask = async (req, res) => {
    const { title, workspaceId, status, position, project } = req.body;

    try {
        const task = await Task.create({
            title,
            workspace: workspaceId,
            project,
            status: status || 'todo',
            position: position || 0,
            createdBy: req.user._id,
            assignee: req.user._id // Auto-assign to creator
        });

        // Create notification for self-assignment (so it shows in "My Tasks")
        const notification = await Notification.create({
            recipient: req.user._id,
            sender: req.user._id,
            type: 'assignment',
            content: `created and assigned you to task "${task.title}"`,
            relatedId: task._id,
            onModel: 'Task'
        });

        const populatedNotification = await Notification.findById(notification._id)
            .populate('sender', 'name avatar');

        // Emit real-time notification
        req.io.to(req.user._id.toString()).emit('notification', populatedNotification);

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Notification = require('../models/Notification');

const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const updates = req.body;
    console.log('Updating task:', taskId, 'with updates:', updates);

    try {
        const oldTask = await Task.findById(taskId);
        const task = await Task.findByIdAndUpdate(taskId, updates, { new: true })
            .populate('assignee', 'name avatar')
            .populate('project', 'name');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Create notification if assignee changed (allow self-notifications for "My Tasks" tracking)
        if (updates.assignee && updates.assignee !== oldTask.assignee?.toString()) {
            const notification = await Notification.create({
                recipient: updates.assignee,
                sender: req.user._id,
                type: 'assignment',
                content: `assigned you to task "${task.title}"`,
                relatedId: task._id,
                onModel: 'Task'
            });

            const populatedNotification = await Notification.findById(notification._id)
                .populate('sender', 'name avatar');

            // Emit real-time notification
            req.io.to(updates.assignee).emit('notification', populatedNotification);
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTaskPosition = async (req, res) => {
    const { taskId } = req.params;
    const { status, position } = req.body;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const oldStatus = task.status;
        const oldPosition = task.position;
        const newStatus = status;
        const newPosition = position;

        // If nothing changed, return
        if (oldStatus === newStatus && oldPosition === newPosition) {
            return res.json(task);
        }

        const session = await Task.startSession();
        session.startTransaction();

        try {
            if (oldStatus === newStatus) {
                // Moving within the same column
                if (oldPosition < newPosition) {
                    // Moving down: Shift items between old and new positions UP (-1)
                    await Task.updateMany(
                        {
                            workspace: task.workspace,
                            status: oldStatus,
                            position: { $gt: oldPosition, $lte: newPosition }
                        },
                        { $inc: { position: -1 } },
                        { session }
                    );
                } else {
                    // Moving up: Shift items between new and old positions DOWN (+1)
                    await Task.updateMany(
                        {
                            workspace: task.workspace,
                            status: oldStatus,
                            position: { $gte: newPosition, $lt: oldPosition }
                        },
                        { $inc: { position: 1 } },
                        { session }
                    );
                }
            } else {
                // Moving to a different column

                // 1. Remove from old column: Shift items below old position UP (-1)
                await Task.updateMany(
                    {
                        workspace: task.workspace,
                        status: oldStatus,
                        position: { $gt: oldPosition }
                    },
                    { $inc: { position: -1 } },
                    { session }
                );

                // 2. Insert into new column: Shift items at/below new position DOWN (+1)
                await Task.updateMany(
                    {
                        workspace: task.workspace,
                        status: newStatus,
                        position: { $gte: newPosition }
                    },
                    { $inc: { position: 1 } },
                    { session }
                );
            }

            // Update the task itself
            task.status = newStatus;
            task.position = newPosition;
            await task.save({ session });

            await session.commitTransaction();
            session.endSession();

            res.json(task);
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }

    } catch (error) {
        console.error('Error updating task position:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTasks, getMyTasks, createTask, updateTask, updateTaskPosition };
