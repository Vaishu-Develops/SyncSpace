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
        primary: 'text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] hover:scale-105 active:scale-95 border border-cyan-400/50 hover:border-cyan-300 transition-all duration-300 font-bold tracking-wide',
        secondary: 'bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] focus:ring-cyan-400 backdrop-blur-sm',
        outline: 'bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] focus:ring-cyan-400',
        ghost: 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white focus:ring-slate-700',
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
