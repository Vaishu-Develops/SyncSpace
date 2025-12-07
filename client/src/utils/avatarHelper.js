/**
 * Helper function to get avatar URL with cache busting
 * This ensures that when an avatar is updated, the new version is loaded
 * instead of serving from browser cache
 */
export const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    
    // Add timestamp as cache buster only if it's a real file URL (not a preview)
    if (avatarPath.startsWith('blob:')) {
        return avatarPath; // Don't modify blob URLs
    }
    
    const separator = avatarPath.includes('?') ? '&' : '?';
    return `${avatarPath}${separator}t=${Date.now()}`;
};

/**
 * Helper to get user initials for fallback avatar
 */
export const getInitials = (name) => {
    if (!name) return '?';
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};
