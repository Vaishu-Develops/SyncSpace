const express = require('express');
const router = express.Router();
const { getDocument, updateDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:workspaceId')
	.get(protect, getDocument)
	.put(protect, updateDocument);

module.exports = router;
