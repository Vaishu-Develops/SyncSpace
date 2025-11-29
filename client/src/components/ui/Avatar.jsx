import PropTypes from 'prop-types';

/**
 * Avatar Component
 * Sizes: xs, sm, md, lg, xl
 * Fallback: Initials with colored background
 * Status indicator (online/offline dot)
 */

const Avatar = ({
    src,
    alt,
    name,
    size = 'md',
    status,
    className = '',
}) => {
    const sizes = {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-2xl',
    };

    const statusSizes = {
        xs: 'h-1.5 w-1.5',
        sm: 'h-2 w-2',
        md: 'h-2.5 w-2.5',
        lg: 'h-3 w-3',
        xl: 'h-4 w-4',
    };

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const getColorFromName = (name) => {
        if (!name) return 'from-slate-600 to-slate-700';
        const colors = [
            'from-primary to-accent',
            'from-secondary to-pink-500',
            'from-success to-green-600',
            'from-warning to-orange-600',
            'from-purple-500 to-indigo-600',
            'from-blue-500 to-cyan-600',
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div className={`relative inline-block rounded-full ${className}`}>
            {src ? (
                <img
                    src={src}
                    alt={alt || name}
                    className={`${sizes[size]} rounded-full object-cover`}
                />
            ) : (
                <div
                    className={`${sizes[size]} rounded-full bg-gradient-to-br ${getColorFromName(name)} flex items-center justify-center text-white font-semibold`}
                >
                    {getInitials(name)}
                </div>
            )}
            {status && (
                <span
                    className={`absolute bottom-0 right-0 ${statusSizes[size]} rounded-full border-2 border-slate-900 ${status === 'online' ? 'bg-success' : 'bg-slate-600'
                        }`}
                />
            )}
        </div>
    );
};

Avatar.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    status: PropTypes.oneOf(['online', 'offline']),
    className: PropTypes.string,
};

/**
 * AvatarGroup Component
 * Displays stacked avatars with max count
 */

export const AvatarGroup = ({ avatars = [], max = 5, size = 'md', className = '' }) => {
    const displayAvatars = avatars.slice(0, max);
    const remaining = avatars.length - max;

    return (
        <div className={`flex -space-x-2 ${className}`}>
            {displayAvatars.map((avatar, index) => (
                <Avatar
                    key={index}
                    {...avatar}
                    size={size}
                    className="ring-2 ring-slate-900"
                />
            ))}
            {remaining > 0 && (
                <div
                    className={`${size === 'xs' ? 'h-6 w-6 text-xs' :
                        size === 'sm' ? 'h-8 w-8 text-sm' :
                            size === 'md' ? 'h-10 w-10 text-base' :
                                size === 'lg' ? 'h-12 w-12 text-lg' :
                                    'h-16 w-16 text-2xl'
                        } rounded-full bg-slate-700 flex items-center justify-center text-gray-300 font-semibold ring-2 ring-slate-900`}
                >
                    +{remaining}
                </div>
            )}
        </div>
    );
};

AvatarGroup.propTypes = {
    avatars: PropTypes.arrayOf(PropTypes.object),
    max: PropTypes.number,
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    className: PropTypes.string,
};

export default Avatar;
