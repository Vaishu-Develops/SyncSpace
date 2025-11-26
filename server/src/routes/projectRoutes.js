const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createProject)
    .get(protect, getProjects);
router.route('/workspace/:workspaceId').get(protect, getProjects);
router.route('/:projectId')
    .get(protect, getProject)
    .put(protect, updateProject)
    .delete(protect, deleteProject);

module.exports = router;
