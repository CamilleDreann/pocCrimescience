import React from 'react';
import { Taskbar } from './Taskbar';
import { MapPin } from 'lucide-react';
import { useOS } from '../../context/OSContext';

import { Window } from './Window';
import { BrowserApp } from '../../apps/Browser/BrowserApp';
import { ExplorerApp } from '../../apps/Explorer/ExplorerApp';
import { MapApp } from '../../apps/Map/MapApp';

const DesktopContent: React.FC = () => {
    const { openWindow } = useOS();

    return (
        <div className="desktop" style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            {/* Background Overlay for vignettes or effects */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                background: 'radial-gradient(circle, transparent 70%, rgba(0,0,0,0.5) 100%)',
                zIndex: 1
            }}></div>

            <div className="desktop-area" style={{ flex: 1, position: 'relative', zIndex: 10 }}>
                <div style={{ padding: '40px', color: 'rgba(255,255,255,0.4)', userSelect: 'none' }}>
                    <h1 style={{ fontSize: '4rem', margin: 0 }}>22:42</h1>
                    <p style={{ fontSize: '1.5rem', margin: 0 }}>Monday, October 24</p>
                </div>

                {/* Desktop Icons */}
                <div style={{
                    position: 'absolute',
                    top: '140px',
                    left: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    {/* Map Icon - Google Maps Style */}
                    <div
                        onDoubleClick={() => openWindow('map')}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            width: '80px',
                            padding: '10px',
                            borderRadius: '8px',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #4285F4 0%, #34A853 50%, #FBBC05 75%, #EA4335 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}>
                            <MapPin size={32} color="#fff" fill="#fff" />
                        </div>
                        <span style={{
                            marginTop: '8px',
                            fontSize: '12px',
                            color: '#fff',
                            textAlign: 'center',
                            textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                        }}>
                            GeoTracker
                        </span>
                    </div>
                </div>

                {/* Render Windows */}
                <Window id="browser" title="Tor Browser (Secure)" initialSize={{ width: 1000, height: 700 }}>
                    <BrowserApp />
                </Window>
                <Window id="explorer" title="File Explorer" initialSize={{ width: 800, height: 600 }}>
                    <ExplorerApp />
                </Window>
                <Window id="mail" title="Mail - 3 Unread">
                    <div style={{ padding: 20 }}>Mail Content Placeholder</div>
                </Window>
                <Window id="map" title="GeoTracker - Localisations" initialSize={{ width: 900, height: 600 }}>
                    <MapApp />
                </Window>
            </div>
            <Taskbar />
        </div>
    );
};

const Desktop: React.FC = () => {
    return (
        // Imported in App.tsx usually, but ensuring it's here if used isolated
        <DesktopContent />
    );
};

export default Desktop;
