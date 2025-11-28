import React from 'react';

const Logo = ({ className = "h-8 w-8", showText = true }) => {
    return (
        <div className="flex items-center gap-2">
            <div className={`${className} relative flex items-center justify-center`}>
                <img
                    src="/logo.svg"
                    alt="SyncSpace Logo"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                />
            </div>
            {showText && (
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    SyncSpace
                </span>
            )}
        </div>
    );
};

export default Logo;
