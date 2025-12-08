/**
 * Migration script to clean up old avatar URLs from local uploads
 * Run this once after deploying Cloudinary integration
 * Usage: node server/scripts/migrateAvatars.js
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../src/models/User');

const migrateAvatars = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find all users with old local avatar URLs
        const oldAvatarPattern = /\/uploads\//;
        const usersWithOldAvatars = await User.find({
            avatar: { $regex: oldAvatarPattern }
        });

        console.log(`Found ${usersWithOldAvatars.length} users with old avatar URLs`);

        if (usersWithOldAvatars.length > 0) {
            // Clear old avatar URLs
            const result = await User.updateMany(
                { avatar: { $regex: oldAvatarPattern } },
                { $set: { avatar: '' } }
            );

            console.log(`✅ Cleared old avatars for ${result.modifiedCount} users`);
            console.log('Users should re-upload their avatars to use Cloudinary');
        } else {
            console.log('No old avatar URLs found');
        }

        await mongoose.connection.close();
        console.log('Migration complete!');
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
};

migrateAvatars();
