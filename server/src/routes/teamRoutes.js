const express = require('express');
const { createTeam, getTeams, addMember } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, createTeam).get(protect, getTeams);
router.route('/:teamId/members').post(protect, addMember);

module.exports = router;
