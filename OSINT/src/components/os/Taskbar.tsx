import React from 'react';
import { Grid, Wifi, Battery, Volume2, Globe, Mail, Folder } from 'lucide-react';
import { useOS, type AppId } from '../../context/OSContext';

export const Taskbar: React.FC = () => {
    const { openWindow, windows } = useOS();
    const [time, setTime] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const TaskbarIcon = ({ id, icon: Icon, label }: { id: AppId, icon: any, label: string }) => {
        const isOpen = windows.find(w => w.id === id)?.isOpen;
        return (
            <button
                onClick={() => openWindow(id)}
                title={label}
                style={{
                    background: isOpen ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                <Icon size={24} />
                {isOpen && <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    width: '40%',
                    height: '3px',
                    background: 'var(--accent-color)',
                    borderRadius: '2px'
                }} />}
            </button>
        );
    }

    const [activeTray, setActiveTray] = React.useState<'none' | 'wifi' | 'volume'>('none');

    const toggleTray = (tray: 'wifi' | 'volume') => {
        setActiveTray(current => current === tray ? 'none' : tray);
    };

    // Close tray when clicking outside (simple solution)
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!(e.target as HTMLElement).closest('.system-tray-icon') && !(e.target as HTMLElement).closest('.tray-popup')) {
                setActiveTray('none');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="taskbar" style={{
            height: 'var(--taskbar-height)',
            background: 'var(--bg-taskbar)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 10px',
            borderTop: '1px solid var(--border-color)',
            userSelect: 'none',
            position: 'relative',
            zIndex: 1000
        }}>
            <div className="start-menu" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer', padding: '8px' }}>
                    <Grid size={20} />
                </button>

                <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)', margin: '0 8px' }}></div>

                <TaskbarIcon id="browser" icon={Globe} label="Browser" />
                <TaskbarIcon id="explorer" icon={Folder} label="Files" />
                <TaskbarIcon id="mail" icon={Mail} label="Mail" />
            </div>

            <div className="system-tray" style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'white', fontSize: '12px', position: 'relative' }}>
                <div className="system-tray-icon" onClick={() => toggleTray('wifi')} style={{ cursor: 'pointer', position: 'relative' }}>
                    <Wifi size={16} />
                    {activeTray === 'wifi' && (
                        <div className="tray-popup" style={{
                            position: 'absolute',
                            bottom: '30px',
                            right: '-50px',
                            width: '200px',
                            background: '#222',
                            border: '1px solid #444',
                            borderRadius: '8px',
                            padding: '10px',
                            color: 'white',
                            zIndex: 1001
                        }} onClick={e => e.stopPropagation()}>
                            <div style={{ marginBottom: '8px', fontWeight: 'bold', borderBottom: '1px solid #444', paddingBottom: '4px' }}>Wi-Fi Networks</div>
                            <div style={{ padding: '4px', background: '#444', borderRadius: '4px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Home_Network</span>
                                <span style={{ color: '#4caf50' }}>Connected</span>
                            </div>
                            <div style={{ padding: '4px', opacity: 0.7 }}>Public_WiFi</div>
                            <div style={{ padding: '4px', opacity: 0.7 }}>Neighbor_5G</div>
                        </div>
                    )}
                </div>

                <div className="system-tray-icon" onClick={() => toggleTray('volume')} style={{ cursor: 'pointer', position: 'relative' }}>
                    <Volume2 size={16} />
                    {activeTray === 'volume' && (
                        <div className="tray-popup" style={{
                            position: 'absolute',
                            bottom: '30px',
                            right: '-20px',
                            width: '40px',
                            height: '150px',
                            background: '#222',
                            border: '1px solid #444',
                            borderRadius: '8px',
                            padding: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: 1001
                        }} onClick={e => e.stopPropagation()}>
                            <div style={{
                                width: '4px',
                                flex: 1,
                                background: '#444',
                                borderRadius: '2px',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'flex-end'
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: '70%',
                                    background: 'var(--accent-color)',
                                    borderRadius: '2px'
                                }}></div>
                            </div>
                        </div>
                    )}
                </div>

                <Battery size={16} />
                <span suppressHydrationWarning style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
};
