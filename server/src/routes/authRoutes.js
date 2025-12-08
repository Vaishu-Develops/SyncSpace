const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { uploadToCloudinary } = require('../config/cloudinary');
const { registerUser, authUser, updateUserProfile, getUserProfile } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
// Use Cloudinary upload for avatar, fallback to local upload if Cloudinary not configured
const avatarUpload = process.env.CLOUDINARY_CLOUD_NAME ? uploadToCloudinary : upload;
router.put('/profile', protect, avatarUpload.single('avatar'), updateUserProfile);

module.exports = router;
