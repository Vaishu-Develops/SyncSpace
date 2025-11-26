const express = require('express');
const { getTasks, getMyTasks, createTask, updateTask, updateTaskPosition } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, createTask);
router.get('/my-tasks', protect, getMyTasks); // Must be before /:workspaceId
router.route('/:workspaceId').get(protect, getTasks);
router.route('/:taskId').put(protect, updateTask);
router.route('/:taskId/position').put(protect, updateTaskPosition);

module.exports = router;
