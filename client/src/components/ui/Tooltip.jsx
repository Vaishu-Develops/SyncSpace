import PropTypes from 'prop-types';
import { useState } from 'react';

/**
 * Tooltip Component
 * Positions: top, bottom, left, right
 * 300ms delay
 * Arrow pointer
 */

const Tooltip = ({
    children,
    content,
    position = 'top',
    delay = 300,
    className = '',
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);

    const showTooltip = () => {
        const id = setTimeout(() => {
            setIsVisible(true);
        }, delay);
        setTimeoutId(id);
    };

    const hideTooltip = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setIsVisible(false);
    };

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrows = {
        top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-800',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-slate-800',
        left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-800',
        right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-slate-800',
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            {children}
            {isVisible && content && (
                <div className={`absolute ${positions[position]} z-50 ${className}`}>
                    <div className="tooltip whitespace-nowrap">
                        {content}
                    </div>
                    <div className={`absolute ${arrows[position]} border-4`} />
                </div>
            )}
        </div>
    );
};

Tooltip.propTypes = {
    children: PropTypes.node.isRequired,
    content: PropTypes.node,
    position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    delay: PropTypes.number,
    className: PropTypes.string,
};

export default Tooltip;
