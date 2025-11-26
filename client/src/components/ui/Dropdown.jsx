import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Dropdown Component
 * Trigger button, menu with items
 * Search filtering, multi-select support
 * Keyboard navigation
 */

const Dropdown = ({
    trigger,
    items = [],
    onSelect,
    selected,
    multiSelect = false,
    searchable = false,
    placeholder = 'Select...',
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState(multiSelect ? (selected || []) : []);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredItems = searchable
        ? items.filter((item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : items;

    const handleSelect = (item) => {
        if (multiSelect) {
            const newSelected = selectedItems.includes(item.value)
                ? selectedItems.filter((v) => v !== item.value)
                : [...selectedItems, item.value];
            setSelectedItems(newSelected);
            onSelect?.(newSelected);
        } else {
            setSelectedItems([item.value]);
            onSelect?.(item.value);
            setIsOpen(false);
        }
    };

    const isSelected = (value) => selectedItems.includes(value);

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            {/* Trigger */}
            {trigger ? (
                <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
            ) : (
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white hover:border-primary transition-colors"
                >
                    <span className="text-sm">
                        {multiSelect
                            ? selectedItems.length > 0
                                ? `${selectedItems.length} selected`
                                : placeholder
                            : selectedItems.length > 0
                                ? items.find((i) => i.value === selectedItems[0])?.label
                                : placeholder}
                    </span>
                    <ChevronDown
                        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>
            )}

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg animate-slide-down">
                    {searchable && (
                        <div className="p-2 border-b border-slate-700">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                                autoFocus
                            />
                        </div>
                    )}
                    <div className="max-h-60 overflow-y-auto p-1">
                        {filteredItems.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-gray-400 text-center">
                                No items found
                            </div>
                        ) : (
                            filteredItems.map((item) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => handleSelect(item)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${isSelected(item.value)
                                        ? 'bg-primary/20 text-primary'
                                        : 'text-white hover:bg-slate-700'
                                        }`}
                                >
                                    <span>{item.label}</span>
                                    {isSelected(item.value) && (
                                        <Check className="h-4 w-4" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

Dropdown.propTypes = {
    trigger: PropTypes.node,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.any.isRequired,
        })
    ),
    onSelect: PropTypes.func,
    selected: PropTypes.oneOfType([PropTypes.any, PropTypes.array]),
    multiSelect: PropTypes.bool,
    searchable: PropTypes.bool,
    placeholder: PropTypes.string,
    className: PropTypes.string,
};

export default Dropdown;
