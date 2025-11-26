const File = require('../models/File');
const path = require('path');
const fs = require('fs');

// Get files for workspace, project, or all user files
const getFiles = async (req, res) => {
    const { workspaceId, projectId } = req.query;

    try {
        let query = {};

        if (projectId) {
            query.project = projectId;
        } else if (workspaceId) {
            query.workspace = workspaceId;
        } else {
            // If no workspace or project specified, return all files uploaded by the user
            // or files in workspaces the user is a member of
            const Workspace = require('../models/Workspace');
            const userWorkspaces = await Workspace.find({ members: req.user._id }).select('_id');
            const workspaceIds = userWorkspaces.map(ws => ws._id);

            query = {
                $or: [
                    { uploadedBy: req.user._id },
                    { workspace: { $in: workspaceIds } }
                ]
            };
        }

        const files = await File.find(query)
            .populate('uploadedBy', 'name avatar email')
            .populate('workspace', 'name')
            .sort({ createdAt: -1 });

        res.json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Upload file
const uploadFile = async (req, res) => {
    const { workspaceId, projectId, description, tags } = req.body;

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const file = await File.create({
            name: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            mimeType: req.file.mimetype,
            workspace: workspaceId,
            project: projectId || null,
            uploadedBy: req.user._id,
            description: description || '',
            tags: tags ? JSON.parse(tags) : []
        });

        const populatedFile = await File.findById(file._id)
            .populate('uploadedBy', 'name avatar email');

        // Emit socket event
        if (req.io) {
            const room = projectId || workspaceId;
            req.io.to(room).emit('file-uploaded', populatedFile);
        }

        res.status(201).json(populatedFile);
    } catch (error) {
        // Clean up file if database save fails
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: error.message });
    }
};

// Download file
const downloadFile = async (req, res) => {
    const { fileId } = req.params;

    try {
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Check if file exists on disk
        if (!fs.existsSync(file.path)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        res.download(file.path, file.originalName);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete file
const deleteFile = async (req, res) => {
    const { fileId } = req.params;

    try {
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Check if user is the uploader or has permission
        if (file.uploadedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this file' });
        }

        // Delete file from disk
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        // Delete all versions
        file.versions.forEach(version => {
            if (fs.existsSync(version.path)) {
                fs.unlinkSync(version.path);
            }
        });

        await file.deleteOne();

        // Emit socket event
        if (req.io) {
            const room = file.project || file.workspace;
            req.io.to(room).emit('file-deleted', { fileId });
        }

        res.json({ message: 'File deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Upload new version
const uploadVersion = async (req, res) => {
    const { fileId } = req.params;

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const file = await File.findById(fileId);

        if (!file) {
            // Clean up uploaded file
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: 'Original file not found' });
        }

        // Add current version to versions array
        file.versions.push({
            version: file.version,
            path: file.path,
            size: file.size,
            uploadedAt: file.updatedAt,
            uploadedBy: file.uploadedBy
        });

        // Update file with new version
        file.version += 1;
        file.path = req.file.path;
        file.size = req.file.size;
        file.name = req.file.filename;
        file.uploadedBy = req.user._id;

        await file.save();

        const populatedFile = await File.findById(file._id)
            .populate('uploadedBy', 'name avatar email');

        // Emit socket event
        if (req.io) {
            const room = file.project || file.workspace;
            req.io.to(room).emit('file-updated', populatedFile);
        }

        res.json(populatedFile);
    } catch (error) {
        // Clean up file if database save fails
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: error.message });
    }
};

// Get file versions
const getFileVersions = async (req, res) => {
    const { fileId } = req.params;

    try {
        const file = await File.findById(fileId)
            .populate('versions.uploadedBy', 'name avatar email')
            .populate('uploadedBy', 'name avatar email');

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.json({
            current: {
                version: file.version,
                size: file.size,
                uploadedAt: file.updatedAt,
                uploadedBy: file.uploadedBy
            },
            versions: file.versions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getFiles,
    uploadFile,
    downloadFile,
    deleteFile,
    uploadVersion,
    getFileVersions
};
