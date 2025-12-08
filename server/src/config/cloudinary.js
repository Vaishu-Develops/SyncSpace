const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
// Supports both CLOUDINARY_URL (single variable) or individual variables
if (process.env.CLOUDINARY_URL) {
    // Cloudinary URL format: cloudinary://api_key:api_secret@cloud_name
    cloudinary.config(process.env.CLOUDINARY_URL);
} else {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

console.log('Cloudinary configured:', cloudinary.config().cloud_name ? 'Yes' : 'No');

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'syncspace/avatars',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            return `avatar-${req.user._id}-${uniqueSuffix}`;
        }
    }
});

// Configure multer with Cloudinary storage
const uploadToCloudinary = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = {
    cloudinary,
    uploadToCloudinary
};
