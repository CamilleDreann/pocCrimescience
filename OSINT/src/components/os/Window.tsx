import React, { useState, useEffect } from 'react';
import { X, Minus, Square } from 'lucide-react';
import { useOS, type AppId } from '../../context/OSContext';

interface WindowProps {
    id: AppId;
    title: string;
    children: React.ReactNode;
    initialPosition?: { x: number; y: number };
    initialSize?: { width: number; height: number };
}

export const Window: React.FC<WindowProps> = ({ id, title, children, initialPosition = { x: 100, y: 50 }, initialSize = { width: 800, height: 600 } }) => {
    const { windows, closeWindow, minimizeWindow, focusWindow, toggleMaximize } = useOS();
    const windowState = windows.find(w => w.id === id);

    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!windowState?.isMaximized) {
            setIsDragging(true);
            setDragOffset({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
        focusWindow(id);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragOffset.x,
                    y: e.clientY - dragOffset.y
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    if (!windowState || !windowState.isOpen || windowState.isMinimized) return null;

    const baseStyle: React.CSSProperties = windowState.isMaximized ? {
        top: 0,
        left: 0,
        width: '100vw',
        height: 'calc(100vh - var(--taskbar-height))',
        borderRadius: 0
    } : {
        top: position.y,
        left: position.x,
        width: initialSize.width,
        height: initialSize.height,
        borderRadius: '8px'
    };

    return (
        <div
            className="os-window"
            style={{
                position: 'absolute',
                ...baseStyle,
                backgroundColor: 'var(--bg-window)',
                borderRadius: baseStyle.borderRadius || '8px',
                boxShadow: 'var(--window-shadow)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: windowState.zIndex,
                overflow: 'hidden',
                border: windowState.isMaximized ? 'none' : '1px solid var(--border-color)',
            }}
            onMouseDown={() => focusWindow(id)}
        >
            {/* Title Bar */}
            <div
                className="window-titlebar"
                onMouseDown={handleMouseDown}
                style={{
                    height: '32px',
                    backgroundColor: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 8px',
                    cursor: windowState.isMaximized ? 'default' : 'grab',
                    userSelect: 'none',
                    borderBottom: '1px solid #444'
                }}
            >
                <span style={{ fontSize: '12px', fontWeight: 500 }}>{title}</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }} style={{ background: 'transparent', border: 'none', color: '#ccc', padding: '2px', cursor: 'pointer' }}><Minus size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); toggleMaximize(id); }} style={{ background: 'transparent', border: 'none', color: '#ccc', padding: '2px', cursor: 'pointer' }}><Square size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); closeWindow(id); }} style={{ background: 'transparent', border: 'none', color: '#ff5f57', padding: '2px', cursor: 'pointer' }}><X size={14} /></button>
                </div>
            </div>

            {/* Content */}
            <div className="window-content" style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                {children}
            </div>
        </div>
    );
};
