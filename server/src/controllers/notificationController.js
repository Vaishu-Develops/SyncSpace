const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate('sender', 'name avatar')
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        if (id === 'all') {
            await Notification.updateMany(
                { recipient: req.user._id, read: false },
                { read: true }
            );
            res.json({ message: 'All notifications marked as read' });
        } else {
            const notification = await Notification.findById(id);
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }

            if (notification.recipient.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            notification.read = true;
            await notification.save();
            res.json(notification);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        if (notification.recipient.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await notification.deleteOne();
        res.json({ message: 'Notification removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    deleteNotification
};
