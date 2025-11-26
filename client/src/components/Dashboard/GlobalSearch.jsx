import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';

const GlobalSearch = ({ className = '' }) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState({
        workspaces: [],
        projects: [],
        tasks: [],
        documents: [],
        files: []
    });
    const searchRef = useRef(null);

    // Mock search results - replace with actual API call
    const performSearch = (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults({ workspaces: [], projects: [], tasks: [], documents: [], files: [] });
            return;
        }

        // Mock data - replace with actual search API
        setResults({
            workspaces: [
                { id: 1, name: 'Marketing Team', icon: '📁' },
                { id: 2, name: 'Product Development', icon: '📁' }
            ],
            projects: [
                { id: 1, name: 'Q1 Campaign Launch', workspace: 'Marketing Team' },
                { id: 2, name: 'Mobile App Redesign', workspace: 'Product Development' }
            ],
            tasks: [
                { id: 1, name: 'Review PR #245', project: 'Mobile App' },
                { id: 2, name: 'Update landing page copy', project: 'Q1 Campaign' }
            ],
            documents: [],
            files: []
        });
    };

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const hasResults = Object.values(results).some(arr => arr.length > 0);

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search workspaces, projects, tasks, or files..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    className="w-full pl-10 pr-4 py-2.5 glass text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
            </div>

            {/* Search Results Dropdown */}
            {isOpen && (query || hasResults) && (
                <div className="absolute top-full mt-2 w-full glass border border-slate-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50 animate-slide-down">
                    {!hasResults && query && (
                        <div className="p-4 text-center text-gray-400">
                            No results found for "{query}"
                        </div>
                    )}

                    {/* Workspaces */}
                    {results.workspaces.length > 0 && (
                        <div className="p-2">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">
                                📁 Workspaces ({results.workspaces.length})
                            </div>
                            {results.workspaces.map((workspace) => (
                                <button
                                    key={workspace.id}
                                    className="w-full px-3 py-2 text-left hover:bg-slate-700/50 rounded-lg transition-colors flex items-center gap-3"
                                    onClick={() => {
                                        setIsOpen(false);
                                        setQuery('');
                                    }}
                                >
                                    <span className="text-2xl">{workspace.icon}</span>
                                    <span className="text-white">{workspace.name}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Projects */}
                    {results.projects.length > 0 && (
                        <div className="p-2 border-t border-slate-700">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">
                                📋 Projects ({results.projects.length})
                            </div>
                            {results.projects.map((project) => (
                                <button
                                    key={project.id}
                                    className="w-full px-3 py-2 text-left hover:bg-slate-700/50 rounded-lg transition-colors"
                                    onClick={() => {
                                        setIsOpen(false);
                                        setQuery('');
                                    }}
                                >
                                    <div className="text-white">{project.name}</div>
                                    <div className="text-xs text-gray-400">{project.workspace}</div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Tasks */}
                    {results.tasks.length > 0 && (
                        <div className="p-2 border-t border-slate-700">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">
                                ✓ Tasks ({results.tasks.length})
                            </div>
                            {results.tasks.map((task) => (
                                <button
                                    key={task.id}
                                    className="w-full px-3 py-2 text-left hover:bg-slate-700/50 rounded-lg transition-colors"
                                    onClick={() => {
                                        setIsOpen(false);
                                        setQuery('');
                                    }}
                                >
                                    <div className="text-white">{task.name}</div>
                                    <div className="text-xs text-gray-400">{task.project}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

GlobalSearch.propTypes = {
    className: PropTypes.string
};

export default GlobalSearch;
