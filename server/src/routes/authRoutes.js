const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { registerUser, authUser, updateUserProfile } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.put('/profile', protect, upload.single('avatar'), updateUserProfile);

module.exports = router;
