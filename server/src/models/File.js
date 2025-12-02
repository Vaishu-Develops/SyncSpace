const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    originalName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    url: {
        type: String
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    version: {
        type: Number,
        default: 1
    },
    parentFile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    },
    versions: [{
        version: Number,
        path: String,
        size: Number,
        uploadedAt: Date,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    tags: [String],
    description: String
}, {
    timestamps: true
});

// Index for faster queries
fileSchema.index({ workspace: 1, createdAt: -1 });
fileSchema.index({ project: 1, createdAt: -1 });
fileSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('File', fileSchema);
