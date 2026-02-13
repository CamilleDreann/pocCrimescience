import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Star } from 'lucide-react';
import { XProfile } from './pages/XProfile';
import { InstaProfile } from './pages/InstaProfile';

// Simple router for the mock browser
type Page = 'home' | 'x_profile' | 'insta_profile';

export const BrowserApp: React.FC = () => {
    const [history, setHistory] = useState<Page[]>(['home']);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [url, setUrl] = useState('https://start.duckduckgo.com');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const query = searchQuery.toLowerCase().trim();

        if (query.includes('leam_99') || query.includes('@leam_99') || query.includes('x.com') || query.includes('twitter')) {
            navigateTo('x_profile', 'https://x.com/LeaM_99');
        } else if (query.includes('lea') || query.includes('léa') || query.includes('instagram') || query.includes('insta') || query.includes('lea.m_private')) {
            navigateTo('insta_profile', 'https://instagram.com/lea.m_private');
        }
    };

    const navigateTo = (page: Page, newUrl: string) => {
        const newHistory = history.slice(0, currentIndex + 1);
        newHistory.push(page);
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
        setUrl(newUrl);
    };

    const goBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            updateUrlFromPage(history[currentIndex - 1]);
        }
    };

    const goForward = () => {
        if (currentIndex < history.length - 1) {
            setCurrentIndex(prev => prev + 1);
            updateUrlFromPage(history[currentIndex + 1]);
        }
    };

    const updateUrlFromPage = (page: Page) => {
        switch (page) {
            case 'x_profile': setUrl('https://x.com/LeaM_99'); break;
            case 'insta_profile': setUrl('https://instagram.com/lea.m_private'); break;
            default: setUrl('https://start.duckduckgo.com'); break;
        }
    }

    const currentPage = history[currentIndex];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', color: '#000' }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px',
                borderBottom: '1px solid #ddd',
                background: '#f0f0f0',
                gap: '8px'
            }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={goBack} disabled={currentIndex === 0} style={{ border: 'none', background: 'transparent', cursor: 'pointer', opacity: currentIndex === 0 ? 0.3 : 1 }}>
                        <ArrowLeft size={16} />
                    </button>
                    <button onClick={goForward} disabled={currentIndex === history.length - 1} style={{ border: 'none', background: 'transparent', cursor: 'pointer', opacity: currentIndex === history.length - 1 ? 0.3 : 1 }}>
                        <ArrowRight size={16} />
                    </button>
                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                        <RotateCw size={16} />
                    </button>
                </div>

                {/* Address Bar */}
                <div style={{
                    flex: 1,
                    background: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <span>{url}</span>
                    <Star size={14} color="#aaa" />
                </div>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflow: 'auto' }}>
                {currentPage === 'home' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '20px' }}>
                        <h2 style={{ fontSize: '2rem', color: '#d9534f' }}>DuckDuckGo</h2>
                        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ padding: '10px', width: '300px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: '#d9534f', color: '#fff' }}>
                                Search
                            </button>
                        </form>
                    </div>
                )}
                {currentPage === 'x_profile' && <XProfile />}
                {currentPage === 'insta_profile' && <InstaProfile />}
            </div>
        </div>
    );
};
