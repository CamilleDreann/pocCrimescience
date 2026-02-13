import React from 'react';
import { Grid, Clapperboard, Play } from 'lucide-react';

export const InstaProfile: React.FC = () => {
    const [viewPost, setViewPost] = React.useState<any>(null);

    const posts = [
        { id: 1, type: 'image', src: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=500&auto=format&fit=crop', likes: 142, comments: 12 },
        { id: 2, type: 'video', src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500&auto=format&fit=crop', likes: 215, comments: 45, views: '12.5k' }, // Reel thumbnail
        { id: 3, type: 'image', src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&auto=format&fit=crop', likes: 89, comments: 8 },
        { id: 4, type: 'image', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop', likes: 312, comments: 22 },
        { id: 5, type: 'image', src: 'https://images.unsplash.com/photo-1529139574466-a302d2d3f524?w=500&auto=format&fit=crop', likes: 167, comments: 14 },
        { id: 6, type: 'image', src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop', likes: 98, comments: 6 },
    ];

    return (
        <div style={{ maxWidth: '935px', margin: '0 auto', padding: '30px 20px', background: '#fff', minHeight: '100%', position: 'relative' }}>
            {/* Header */}
            <div style={{ display: 'flex', marginBottom: '44px', alignItems: 'center' }}>
                <div style={{ flexShrink: 0, width: '290px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #dbdbdb' }}>
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>

                <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '400', margin: 0 }}>lea.m_private</h2>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{ padding: '5px 9px', background: '#efefef', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>Follow</button>
                            <button style={{ padding: '5px 9px', background: '#efefef', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>Message</button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '40px', marginBottom: '20px', fontSize: '16px' }}>
                        <div><span style={{ fontWeight: 'bold' }}>{posts.length}</span> posts</div>
                        <div><span style={{ fontWeight: 'bold' }}>328</span> followers</div>
                        <div><span style={{ fontWeight: 'bold' }}>215</span> following</div>
                    </div>

                    <div>
                        <div style={{ fontWeight: 'bold' }}>Léa M.</div>
                        <div>22ans 🎂</div>
                        <div>Student | Paris</div>
                        <div>✨ Live laugh love ✨</div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid #dbdbdb', display: 'flex', justifyContent: 'center', gap: '60px', fontSize: '12px', letterSpacing: '1px', fontWeight: 'bold', color: '#8e8e8e', marginBottom: '20px' }}>
                <div style={{ paddingTop: '15px', borderTop: '1px solid #262626', color: '#262626', display: 'flex', alignItems: 'center', gap: '6px' }}><Grid size={12} /> POSTS</div>
                <div style={{ paddingTop: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}><Clapperboard size={12} /> REELS</div>
                <div style={{ paddingTop: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}><Play size={12} /> TAGGED</div>
            </div>

            {/* Post Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
                {posts.map(post => (
                    <div
                        key={post.id}
                        onClick={() => setViewPost(post)}
                        style={{ aspectRatio: '1/1', position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
                    >
                        <img src={post.src} alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {post.type === 'video' && (
                            <div style={{ position: 'absolute', top: 10, right: 10, color: 'white' }}>
                                <Clapperboard size={20} fill="white" />
                            </div>
                        )}
                        {/* Hover Overlay (Simulated via always-visible stats on bottom or just hover logic if CSS was separate. Keeping it simple) */}
                        <div className="post-overlay" style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.3)', opacity: 0, transition: 'opacity 0.2s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', gap: '20px'
                        }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                        >
                            <span>❤️ {post.likes}</span>
                            <span>💬 {post.comments}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Post Modal */}
            {viewPost && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} onClick={() => setViewPost(null)}>
                    <div style={{ background: '#fff', maxWidth: '900px', width: '90%', height: '80%', maxHeight: '600px', display: 'flex', borderRadius: '4px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                        {/* Media Side */}
                        <div style={{ flex: 1.5, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            {viewPost.type === 'video' ? (
                                <div style={{ color: 'white', textAlign: 'center' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>▶️</div>
                                    <div>Video playing...</div>
                                    <div style={{ fontSize: '0.8rem', marginTop: '10px', color: '#ccc' }}>Simulated Video Content</div>
                                </div>
                            ) : (
                                <img src={viewPost.src} alt="Post" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            )}
                        </div>
                        {/* Comments Side */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderLeft: '1px solid #efefef' }}>
                            <div style={{ padding: '16px', borderBottom: '1px solid #efefef', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden' }}>
                                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <span style={{ fontWeight: 'bold' }}>lea.m_private</span>
                            </div>

                            <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <span style={{ fontWeight: 'bold', marginRight: '5px' }}>lea.m_private</span>
                                    {viewPost.type === 'video' ? 'Sunday exploration 🏭 #urbex' : 'Paris aesthetic ✨'}
                                </div>
                                {/* Mock Comments */}
                                <div style={{ marginBottom: '10px' }}><span style={{ fontWeight: 'bold', marginRight: '5px' }}>alex_under</span>Wow! Where is this?</div>
                                <div style={{ marginBottom: '10px' }}><span style={{ fontWeight: 'bold', marginRight: '5px' }}>sophie.t</span>Love the composition! 😍</div>
                            </div>

                            <div style={{ padding: '16px', borderTop: '1px solid #efefef' }}>
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '24px', cursor: 'pointer' }}>❤️</span>
                                    <span style={{ fontSize: '24px', cursor: 'pointer' }}>💬</span>
                                    <span style={{ fontSize: '24px', cursor: 'pointer' }}>🚀</span>
                                </div>
                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{viewPost.likes} likes</div>
                                <div style={{ fontSize: '10px', color: '#8e8e8e', textTransform: 'uppercase' }}>2 DAYS AGO</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
