import PropTypes from 'prop-types';
import { X } from 'lucide-react';

/**
 * Badge Component
 * Variants: default, primary, success, warning, danger
 * Sizes: sm, md
 * Optional: Removable (X icon)
 */

const Badge = ({
    children,
    variant = 'default',
    size = 'sm',
    removable = false,
    onRemove,
    className = '',
}) => {
    const baseStyles = 'inline-flex items-center rounded-full font-medium border';

    const variants = {
        default: 'bg-slate-700/50 text-gray-300 border-slate-600',
        primary: 'bg-primary/20 text-primary border-primary/30',
        success: 'bg-success/20 text-success border-success/30',
        warning: 'bg-warning/20 text-warning border-warning/30',
        danger: 'bg-danger/20 text-danger border-danger/30',
    };

    const sizes = {
        sm: 'px-2.5 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
    };

    return (
        <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
            {removable && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="ml-1 -mr-1 hover:opacity-70 transition-opacity"
                >
                    <X className="h-3 w-3" />
                </button>
            )}
        </span>
    );
};

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger']),
    size: PropTypes.oneOf(['sm', 'md']),
    removable: PropTypes.bool,
    onRemove: PropTypes.func,
    className: PropTypes.string,
};

export default Badge;
