const express = require('express');
const router = express.Router();
const {
    getFiles,
    uploadFile,
    downloadFile,
    deleteFile,
    uploadVersion,
    getFileVersions
} = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', protect, getFiles);
router.post('/', protect, upload.single('file'), uploadFile);
router.get('/:fileId/download', protect, downloadFile);
router.delete('/:fileId', protect, deleteFile);
router.post('/:fileId/version', protect, upload.single('file'), uploadVersion);
router.get('/:fileId/versions', protect, getFileVersions);

module.exports = router;
