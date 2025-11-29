import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

/**
 * Button Component
 * Variants: primary, secondary, outline, ghost, danger
 * Sizes: sm, md, lg
 * States: default, hover, active, disabled, loading
 */

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    className = '',
    onClick,
    type = 'button',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

    const variants = {
        primary: 'text-white bg-gradient-to-r from-cyan-400 to-fuchsia-500 shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 hover:brightness-110 focus:ring-fuchsia-500 border border-white/10',
        secondary: 'bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 hover:border-fuchsia-500 focus:ring-fuchsia-500',
        outline: 'bg-transparent border-2 border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-500/10 hover:text-fuchsia-300 focus:ring-fuchsia-500',
        ghost: 'bg-transparent text-gray-400 hover:bg-slate-800 hover:text-white focus:ring-slate-700',
        danger: 'bg-danger text-white shadow-glow-danger hover:opacity-90 hover:shadow-glow-danger focus:ring-danger',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const iconSizes = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading && (
                <Loader2 className={`${iconSizes[size]} mr-2 animate-spin`} />
            )}
            {!loading && icon && iconPosition === 'left' && (
                <span className={`${iconSizes[size]} mr-2`}>{icon}</span>
            )}
            {children}
            {!loading && icon && iconPosition === 'right' && (
                <span className={`${iconSizes[size]} ml-2`}>{icon}</span>
            )}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    icon: PropTypes.node,
    iconPosition: PropTypes.oneOf(['left', 'right']),
    className: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;
