const express = require('express');
const { createWorkspace, getWorkspaces, getWorkspaceById, updateWorkspace, deleteWorkspace, getWorkspaceMembers } = require('../controllers/workspaceController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, createWorkspace).get(protect, getWorkspaces);
router.route('/:id').get(protect, getWorkspaceById).put(protect, updateWorkspace).delete(protect, deleteWorkspace);
router.route('/:id/members').get(protect, getWorkspaceMembers);

module.exports = router;
