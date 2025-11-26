const express = require('express');
const router = express.Router();
const {
    getMessages,
    createMessage,
    updateMessage,
    deleteMessage,
    markAsRead
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getMessages)
    .post(protect, createMessage);

router.route('/:messageId')
    .put(protect, updateMessage)
    .delete(protect, deleteMessage);

router.put('/:messageId/read', protect, markAsRead);

module.exports = router;
