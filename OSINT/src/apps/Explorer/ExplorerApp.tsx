import React, { useState } from 'react';
import { HardDrive, Smartphone, Folder, File, ArrowLeft } from 'lucide-react';

type ItemType = 'folder' | 'file';

interface FileSystemItem {
    name: string;
    type: ItemType;
    content?: string; // For files
    children?: FileSystemItem[]; // For folders
}

// Mock Data
const DRIVE_C: FileSystemItem[] = [
    { name: 'Windows', type: 'folder', children: [] },
    {
        name: 'Users', type: 'folder', children: [
            {
                name: 'Admin', type: 'folder', children: [
                    {
                        name: 'Documents', type: 'folder', children: [
                            { name: 'Project_Alpha.docx', type: 'file' },
                            { name: 'Budget_2024.xlsx', type: 'file' }
                        ]
                    },
                    { name: 'Downloads', type: 'folder', children: [] }
                ]
            }
        ]
    }
];

const DRIVE_D: FileSystemItem[] = [
    {
        name: 'Photos', type: 'folder', children: [
            { name: 'Vacation_2023', type: 'folder', children: [] },
            { name: 'Family', type: 'folder', children: [] }
        ]
    },
    { name: 'Backups', type: 'folder', children: [] }
];

const SIM_CARD: FileSystemItem[] = [
    { name: 'Contacts.vcf', type: 'file' },
    { name: 'Messages.db', type: 'file' },
    { name: 'CallLog.db', type: 'file' }
];

export const ExplorerApp: React.FC = () => {
    const [currentPath, setCurrentPath] = useState<string[]>([]); // [] = Root

    // Helper to get current items based on path
    const getCurrentItems = (): FileSystemItem[] | null => {
        if (currentPath.length === 0) return null; // Root view has special handling

        const driveName = currentPath[0];
        let currentLevel: FileSystemItem[] | undefined;

        if (driveName === 'C:') currentLevel = DRIVE_C;
        else if (driveName === 'D:') currentLevel = DRIVE_D;
        else if (driveName === 'SIM') currentLevel = SIM_CARD;
        else return [];

        for (let i = 1; i < currentPath.length; i++) {
            const folderName = currentPath[i];
            const folder: FileSystemItem | undefined = currentLevel?.find(item => item.name === folderName && item.type === 'folder');
            if (folder && folder.children) {
                currentLevel = folder.children;
            } else {
                return []; // Path not found
            }
        }
        return currentLevel || [];
    };

    const navigateTo = (name: string) => {
        setCurrentPath([...currentPath, name]);
    };

    const navigateUp = () => {
        if (currentPath.length > 0) {
            setCurrentPath(currentPath.slice(0, -1));
        }
    };

    const currentItems = getCurrentItems();

    const [previewFile, setPreviewFile] = useState<FileSystemItem | null>(null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f0f0f0', color: '#333', position: 'relative' }}>
            {/* Toolbar */}
            <div style={{ padding: '8px', borderBottom: '1px solid #ccc', background: '#e0e0e0', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button onClick={navigateUp} disabled={currentPath.length === 0} style={{ border: 'none', background: 'transparent', cursor: 'pointer', opacity: currentPath.length === 0 ? 0.3 : 1 }}>
                    <ArrowLeft size={20} />
                </button>
                <div style={{ background: '#fff', padding: '4px 8px', borderRadius: '4px', flex: 1, border: '1px solid #ccc', fontSize: '14px' }}>
                    This PC {currentPath.length > 0 ? '> ' + currentPath.join(' > ') : ''}
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
                {currentPath.length === 0 ? (
                    // Root View (Drives)
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '20px' }}>
                        <div onClick={() => navigateTo('C:')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                            <HardDrive size={48} color="#555" />
                            <span style={{ marginTop: '5px', fontWeight: 500 }}>Local Disk (C:)</span>
                        </div>
                        <div onClick={() => navigateTo('D:')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                            <HardDrive size={48} color="#555" />
                            <span style={{ marginTop: '5px', fontWeight: 500 }}>Data (D:)</span>
                        </div>
                        <div onClick={() => navigateTo('SIM')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                            <Smartphone size={48} color="#555" />
                            <span style={{ marginTop: '5px', fontWeight: 500 }}>SIM Card</span>
                        </div>
                    </div>
                ) : (
                    // Folder View
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '15px' }}>
                        {currentItems?.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => item.type === 'folder' ? navigateTo(item.name) : setPreviewFile(item)}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                            >
                                {item.type === 'folder' ? (
                                    <Folder size={40} color="#f8d775" fill="#f8d775" />
                                ) : (
                                    <File size={40} color="#888" />
                                )}
                                <span style={{ marginTop: '5px', fontSize: '12px', textAlign: 'center', wordBreak: 'break-word' }}>{item.name}</span>
                            </div>
                        ))}
                        {currentItems?.length === 0 && <div style={{ color: '#888' }}>This folder is empty.</div>}
                    </div>
                )}
            </div>

            {/* File Preview Modal */}
            {previewFile && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                }} onClick={() => setPreviewFile(null)}>
                    <div style={{
                        background: '#fff',
                        width: '80%',
                        height: '80%',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600 }}>{previewFile.name}</span>
                            <button onClick={() => setPreviewFile(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                        </div>
                        <div style={{ flex: 1, padding: '20px', overflow: 'auto', background: '#f9f9f9', fontFamily: 'monospace' }}>
                            {/* Mock Content Display */}
                            <p>Content of {previewFile.name}...</p>
                            <p style={{ color: '#666', marginTop: '10px', fontSize: '0.9rem' }}>
                                (This is a simplified file viewer. Real file content would appear here.)
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
