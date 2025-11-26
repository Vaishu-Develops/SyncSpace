import PropTypes from 'prop-types';
import { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';

/**
 * Input Component
 * Types: text, email, password, number, date
 * States: default, focus, error, disabled
 * Features: label, helper text, error message, icon, clear button
 */

const Input = ({
    type = 'text',
    label,
    placeholder,
    value,
    onChange,
    onClear,
    error,
    helperText,
    disabled = false,
    icon,
    showClearButton = false,
    className = '',
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = type === 'password' && showPassword ? 'text' : type;

    const handleClear = () => {
        if (onClear) {
            onClear();
        } else if (onChange) {
            onChange({ target: { value: '' } });
        }
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="h-5 w-5 text-gray-500">{icon}</span>
                    </div>
                )}
                <input
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
                        block w-full px-4 py-2 bg-slate-800 border rounded-lg text-white placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${icon ? 'pl-10' : ''}
                        ${showClearButton || type === 'password' ? 'pr-10' : ''}
                        ${error
                            ? 'border-danger focus:ring-danger'
                            : isFocused
                                ? 'border-primary focus:ring-primary shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                                : 'border-slate-700 focus:ring-primary'
                        }
                    `}
                    {...props}
                />
                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </button>
                )}
                {showClearButton && value && type !== 'password' && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                        tabIndex={-1}
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-danger">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1 text-sm text-gray-400">{helperText}</p>
            )}
        </div>
    );
};

Input.propTypes = {
    type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'date']),
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    error: PropTypes.string,
    helperText: PropTypes.string,
    disabled: PropTypes.bool,
    icon: PropTypes.node,
    showClearButton: PropTypes.bool,
    className: PropTypes.string,
};

export default Input;
