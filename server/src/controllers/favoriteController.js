const Favorite = require('../models/Favorite');
const Workspace = require('../models/Workspace');
const Project = require('../models/Project');
const Document = require('../models/Document');
const File = require('../models/File');
const mongoose = require('mongoose');

const toValidObjectIds = (ids = []) => {
    return ids
        .map(id => (id ? id.toString() : null))
        .filter(id => id && mongoose.Types.ObjectId.isValid(id))
        .map(id => new mongoose.Types.ObjectId(id));
};

// Get all favorites for the current user
const getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.user._id });

        if (!favorites.length) {
            return res.json({ workspaces: [], projects: [], documents: [], files: [] });
        }

        // Group favorites by type and validate ids before querying
        const workspaceIds = toValidObjectIds(favorites.filter(f => f.itemType === 'workspace').map(f => f.itemId));
        const projectIds = toValidObjectIds(favorites.filter(f => f.itemType === 'project').map(f => f.itemId));
        const documentIds = toValidObjectIds(favorites.filter(f => f.itemType === 'document').map(f => f.itemId));
        const fileIds = toValidObjectIds(favorites.filter(f => f.itemType === 'file').map(f => f.itemId));

        console.log('[favorites] grouped ids', {
            user: req.user._id?.toString(),
            workspaceCount: workspaceIds.length,
            projectCount: projectIds.length,
            documentCount: documentIds.length,
            fileCount: fileIds.length
        });

        const fetchPromises = [];
        if (workspaceIds.length) {
            fetchPromises.push(
                Workspace.find({ _id: { $in: workspaceIds } })
                    .populate({
                        path: 'team',
                        populate: {
                            path: 'members.user',
                            select: 'name avatar'
                        }
                    })
                    .populate('createdBy', 'name avatar')
                    .lean()
                    .then(items => items.map(workspace => ({
                        ...workspace,
                        members: (workspace.team?.members || [])
                            .map(member => member.user)
                            .filter(Boolean)
                    })))
            );
        } else {
            fetchPromises.push(Promise.resolve([]));
        }
        if (projectIds.length) {
            fetchPromises.push(Project.find({ _id: { $in: projectIds } }).populate('workspace', 'name'));
        } else {
            fetchPromises.push(Promise.resolve([]));
        }
        if (documentIds.length) {
            fetchPromises.push(Document.find({ _id: { $in: documentIds } }).populate('workspace', 'name'));
        } else {
            fetchPromises.push(Promise.resolve([]));
        }
        if (fileIds.length) {
            fetchPromises.push(File.find({ _id: { $in: fileIds } }).populate('uploadedBy', 'name avatar'));
        } else {
            fetchPromises.push(Promise.resolve([]));
        }

        const [workspaces, projects, documents, files] = await Promise.all(fetchPromises);

        res.json({
            workspaces,
            projects,
            documents,
            files
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: error.message });
    }
};

// Toggle favorite (add or remove)
const toggleFavorite = async (req, res) => {
    const { itemType, itemId } = req.body;
    const normalizedItemId = itemId && itemId.toString ? itemId.toString() : itemId;

    if (!normalizedItemId || !mongoose.Types.ObjectId.isValid(normalizedItemId)) {
        return res.status(400).json({ message: 'Invalid itemId provided' });
    }

    try {
        // Check if already favorited
        const existing = await Favorite.findOne({
            user: req.user._id,
            itemType,
            itemId: normalizedItemId
        });

        if (existing) {
            // Remove from favorites
            await existing.deleteOne();
            res.json({ message: 'Removed from favorites', isFavorite: false });
        } else {
            // Add to favorites
            const favorite = await Favorite.create({
                user: req.user._id,
                itemType,
                itemId: normalizedItemId
            });
            res.status(201).json({ message: 'Added to favorites', isFavorite: true, favorite });
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({ message: error.message });
    }
};

// Check if item is favorited
const checkFavorite = async (req, res) => {
    const { itemType, itemId } = req.query;
    const normalizedItemId = itemId && itemId.toString ? itemId.toString() : itemId;

    if (!normalizedItemId || !mongoose.Types.ObjectId.isValid(normalizedItemId)) {
        return res.json({ isFavorite: false });
    }

    try {
        const favorite = await Favorite.findOne({
            user: req.user._id,
            itemType,
            itemId: normalizedItemId
        });

        res.json({ isFavorite: !!favorite });
    } catch (error) {
        console.error('Error checking favorite:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getFavorites,
    toggleFavorite,
    checkFavorite
};
