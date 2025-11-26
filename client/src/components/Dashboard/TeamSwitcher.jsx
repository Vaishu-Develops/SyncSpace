import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Plus } from 'lucide-react';

const TeamSwitcher = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentTeam, setCurrentTeam] = useState({
        id: 1,
        name: 'Acme Corp',
        role: 'Admin'
    });
    const dropdownRef = useRef(null);

    // Mock teams - replace with actual data
    const teams = [
        { id: 1, name: 'Acme Corp', role: 'Admin' },
        { id: 2, name: 'Design Studio', role: 'Member' },
        { id: 3, name: 'Side Project', role: 'Admin' }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="p-4 border-b border-slate-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 glass rounded-lg hover:bg-slate-700/50 transition-colors group"
            >
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {currentTeam.name.charAt(0)}
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-semibold text-white">{currentTeam.name}</p>
                        <p className="text-xs text-gray-400">{currentTeam.role}</p>
                    </div>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute left-4 right-4 mt-2 glass border border-slate-700 rounded-lg shadow-2xl z-50 animate-slide-down">
                    <div className="p-2">
                        {teams.map((team) => (
                            <button
                                key={team.id}
                                onClick={() => {
                                    setCurrentTeam(team);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center justify-between p-3 hover:bg-slate-700/50 rounded-lg transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                                        {team.name.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-white">{team.name}</p>
                                        <p className="text-xs text-gray-400">{team.role}</p>
                                    </div>
                                </div>
                                {currentTeam.id === team.id && (
                                    <Check className="h-4 w-4 text-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="p-2 border-t border-slate-700">
                        <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-700/50 rounded-lg transition-colors text-primary">
                            <Plus className="h-4 w-4" />
                            <span className="text-sm font-medium">Create New Team</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamSwitcher;
