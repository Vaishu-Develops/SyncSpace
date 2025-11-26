const Document = require('../models/Document');

const getDocument = async (req, res) => {
    const { workspaceId } = req.params;
    const { projectId } = req.query;

    try {
        const query = { workspace: workspaceId };
        if (projectId) {
            query.project = projectId;
        }

        let document = await Document.findOne(query);

        if (!document) {
            document = await Document.create({
                workspace: workspaceId,
                project: projectId,
                content: '',
            });
        }

        res.json(document);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDocument = async (req, res) => {
    const { workspaceId } = req.params;
    const { content, projectId } = req.body;

    try {
        const query = { workspace: workspaceId };
        if (projectId) {
            query.project = projectId;
        }

        const document = await Document.findOneAndUpdate(
            query,
            { content },
            { new: true, upsert: true }
        );

        res.json(document);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDocument, updateDocument };
