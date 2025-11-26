const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    attachments: [{
        filename: String,
        url: String,
        size: Number,
        type: String
    }],
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: Date,
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Index for faster queries
messageSchema.index({ workspace: 1, createdAt: -1 });
messageSchema.index({ project: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
