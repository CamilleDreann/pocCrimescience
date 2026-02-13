import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ZoomIn, ZoomOut, Crosshair } from 'lucide-react';

// Fix for default marker icons in Leaflet with bundlers
const createIcon = (color: string) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            width: 24px;
            height: 24px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 2px 5px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24]
    });
};

interface Location {
    id: number;
    name: string;
    type: 'suspect' | 'witness' | 'evidence' | 'poi';
    lat: number;
    lng: number;
    description: string;
    timestamp?: string;
}

const LOCATIONS: Location[] = [
    { id: 1, name: 'Domicile suspect', type: 'suspect', lat: 48.8566, lng: 2.3522, description: 'Adresse principale de Léa M.', timestamp: '24/10/2024 - 08:30' },
    { id: 2, name: 'Lieu de travail', type: 'poi', lat: 48.8606, lng: 2.3376, description: 'Entreprise TechCorp - Employeur actuel', timestamp: '24/10/2024 - 09:15' },
    { id: 3, name: 'Café Le Central', type: 'evidence', lat: 48.8530, lng: 2.3499, description: 'Dernier lieu connu - Photo Instagram', timestamp: '23/10/2024 - 19:45' },
    { id: 4, name: 'Gare du Nord', type: 'poi', lat: 48.8809, lng: 2.3553, description: 'Localisation téléphone - Signal perdu', timestamp: '23/10/2024 - 21:30' },
    { id: 5, name: 'Témoin #1', type: 'witness', lat: 48.8650, lng: 2.3450, description: 'Marc D. - A vu le suspect le 23/10' },
];

const TYPE_COLORS: Record<string, string> = {
    suspect: '#e74c3c',
    witness: '#3498db',
    evidence: '#f39c12',
    poi: '#9b59b6',
};

const TYPE_LABELS: Record<string, string> = {
    suspect: 'Suspect',
    witness: 'Témoin',
    evidence: 'Preuve',
    poi: 'Point d\'intérêt',
};

// Component to handle map controls
const MapControls: React.FC<{ onCenter: () => void }> = ({ onCenter }) => {
    const map = useMap();

    return (
        <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
        }}>
            <button onClick={() => map.zoomIn()} style={{
                width: '36px',
                height: '36px',
                border: 'none',
                borderRadius: '4px',
                background: '#16213e',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
            }}>
                <ZoomIn size={18} />
            </button>
            <button onClick={() => map.zoomOut()} style={{
                width: '36px',
                height: '36px',
                border: 'none',
                borderRadius: '4px',
                background: '#16213e',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
            }}>
                <ZoomOut size={18} />
            </button>
            <button onClick={onCenter} style={{
                width: '36px',
                height: '36px',
                border: 'none',
                borderRadius: '4px',
                background: '#16213e',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
            }}>
                <Crosshair size={18} />
            </button>
        </div>
    );
};

// Component to fly to location
const FlyToLocation: React.FC<{ location: Location | null }> = ({ location }) => {
    const map = useMap();

    React.useEffect(() => {
        if (location) {
            map.flyTo([location.lat, location.lng], 15, { duration: 1 });
        }
    }, [location, map]);

    return null;
};

export const MapApp: React.FC = () => {
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [filter, setFilter] = useState<string | null>(null);
    const [mapRef, setMapRef] = useState<L.Map | null>(null);

    const filteredLocations = filter
        ? LOCATIONS.filter(loc => loc.type === filter)
        : LOCATIONS;

    const centerMap = () => {
        if (mapRef) {
            mapRef.flyTo([48.8566, 2.3522], 13, { duration: 1 });
        }
    };

    return (
        <div style={{ display: 'flex', height: '100%', background: '#1a1a2e', color: '#fff' }}>
            {/* Sidebar */}
            <div style={{
                width: '280px',
                background: '#16213e',
                borderRight: '1px solid #0f3460',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{
                    padding: '15px',
                    borderBottom: '1px solid #0f3460',
                    background: '#0f3460'
                }}>
                    <h3 style={{ margin: 0, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        LOCALISATIONS
                    </h3>
                </div>

                {/* Filters */}
                <div style={{ padding: '10px', borderBottom: '1px solid #0f3460', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    <button
                        onClick={() => setFilter(null)}
                        style={{
                            padding: '4px 8px',
                            fontSize: '11px',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            background: filter === null ? '#e94560' : '#0f3460',
                            color: '#fff'
                        }}
                    >
                        Tous
                    </button>
                    {Object.entries(TYPE_LABELS).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            style={{
                                padding: '4px 8px',
                                fontSize: '11px',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                background: filter === key ? TYPE_COLORS[key] : '#0f3460',
                                color: '#fff'
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Location List */}
                <div style={{ flex: 1, overflow: 'auto' }}>
                    {filteredLocations.map(loc => (
                        <div
                            key={loc.id}
                            onClick={() => setSelectedLocation(loc)}
                            style={{
                                padding: '12px 15px',
                                borderBottom: '1px solid #0f3460',
                                cursor: 'pointer',
                                background: selectedLocation?.id === loc.id ? '#0f3460' : 'transparent',
                                transition: 'background 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <div style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: TYPE_COLORS[loc.type]
                                }} />
                                <span style={{ fontWeight: 600, fontSize: '13px' }}>{loc.name}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#888', marginLeft: '18px' }}>
                                {loc.description.substring(0, 40)}...
                            </div>
                            {loc.timestamp && (
                                <div style={{ fontSize: '10px', color: '#666', marginLeft: '18px', marginTop: '2px' }}>
                                    {loc.timestamp}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Map Area */}
            <div style={{ flex: 1, position: 'relative' }}>
                <MapContainer
                    center={[48.8566, 2.3522]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                    ref={setMapRef}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {filteredLocations.map(loc => (
                        <Marker
                            key={loc.id}
                            position={[loc.lat, loc.lng]}
                            icon={createIcon(TYPE_COLORS[loc.type])}
                            eventHandlers={{
                                click: () => setSelectedLocation(loc)
                            }}
                        >
                            <Popup>
                                <div style={{ minWidth: '200px' }}>
                                    <div style={{
                                        background: TYPE_COLORS[loc.type],
                                        color: '#fff',
                                        padding: '8px',
                                        margin: '-13px -20px 10px -20px',
                                        fontWeight: 600
                                    }}>
                                        {loc.name}
                                    </div>
                                    <div style={{ marginBottom: '5px' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '2px 6px',
                                            background: TYPE_COLORS[loc.type],
                                            color: '#fff',
                                            borderRadius: '3px',
                                            fontSize: '10px'
                                        }}>
                                            {TYPE_LABELS[loc.type]}
                                        </span>
                                    </div>
                                    <p style={{ margin: '5px 0', fontSize: '12px' }}>{loc.description}</p>
                                    {loc.timestamp && (
                                        <div style={{ fontSize: '10px', color: '#666' }}>
                                            {loc.timestamp}
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    <MapControls onCenter={centerMap} />
                    <FlyToLocation location={selectedLocation} />
                </MapContainer>

                {/* Legend */}
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '10px',
                    background: 'rgba(22, 33, 62, 0.9)',
                    padding: '10px',
                    borderRadius: '6px',
                    zIndex: 1000,
                    fontSize: '11px'
                }}>
                    <div style={{ fontWeight: 600, marginBottom: '8px' }}>Légende</div>
                    {Object.entries(TYPE_LABELS).map(([key, label]) => (
                        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: TYPE_COLORS[key]
                            }} />
                            <span>{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
