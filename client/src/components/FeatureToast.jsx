import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Sparkles } from 'lucide-react';

const FeatureToast = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show the toast after a short delay when component mounts
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1000);

        // Auto-hide after 5 seconds
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, 6000);

        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
            <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-xl shadow-xl backdrop-blur-xl border border-white/20 max-w-sm">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-white font-semibold text-sm mb-1">
                            New Features Active! ✨
                        </h3>
                        <p className="text-white/90 text-xs leading-relaxed">
                            Enhanced UI components, theme toggle, and improved navigation are now live!
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-white/80">
                    <CheckCircle className="h-3 w-3" />
                    <span>Logo, Header, Theme Toggle</span>
                </div>
            </div>
        </div>
    );
};

export default FeatureToast;