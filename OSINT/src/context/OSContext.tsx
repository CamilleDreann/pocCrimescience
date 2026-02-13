import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type AppId = 'browser' | 'mail' | 'explorer' | 'settings' | 'map';

export interface WindowState {
    id: AppId;
    title: string;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
}

interface OSContextType {
    windows: WindowState[];
    openWindow: (id: AppId) => void;
    closeWindow: (id: AppId) => void;
    minimizeWindow: (id: AppId) => void;
    focusWindow: (id: AppId) => void;
    toggleMaximize: (id: AppId) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export const OSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [windows, setWindows] = useState<WindowState[]>([
        // Initial State: Browser might be open or ready to open
        { id: 'browser', title: 'Web Browser', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1 },
        { id: 'explorer', title: 'File Explorer', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1 },
        { id: 'mail', title: 'Mail', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1 },
        { id: 'map', title: 'GeoTracker', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1 },
    ]);

    const [zIndexCounter, setZIndexCounter] = useState(10);

    const openWindow = (id: AppId) => {
        setWindows(prev => prev.map(w => {
            if (w.id === id) {
                return { ...w, isOpen: true, isMinimized: false, zIndex: zIndexCounter + 1 };
            }
            return w;
        }));
        setZIndexCounter(c => c + 1);
    };

    const closeWindow = (id: AppId) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
    };

    const minimizeWindow = (id: AppId) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
    };

    const focusWindow = (id: AppId) => {
        setWindows(prev => prev.map(w => {
            if (w.id === id) {
                return { ...w, zIndex: zIndexCounter + 1 };
            }
            return w;
        }));
        setZIndexCounter(c => c + 1);
    };

    const toggleMaximize = (id: AppId) => {
        setWindows(prev => prev.map(w => {
            if (w.id === id) {
                return { ...w, isMaximized: !w.isMaximized, zIndex: zIndexCounter + 1 };
            }
            return w;
        }));
        setZIndexCounter(c => c + 1);
    };

    return (
        <OSContext.Provider value={{ windows, openWindow, closeWindow, minimizeWindow, focusWindow, toggleMaximize }}>
            {children}
        </OSContext.Provider>
    );
};

export const useOS = () => {
    const context = useContext(OSContext);
    if (context === undefined) {
        throw new Error('useOS must be used within an OSProvider');
    }
    return context;
};
