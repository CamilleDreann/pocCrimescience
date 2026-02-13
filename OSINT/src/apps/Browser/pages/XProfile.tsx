import React from 'react';
import { Calendar, MapPin, Link as LinkIcon, MessageCircle, Repeat2, Heart, Share } from 'lucide-react';

const FollowButton: React.FC = () => {
    const [following, setFollowing] = React.useState(false);
    return (
        <button
            onClick={() => setFollowing(!following)}
            style={{
                borderRadius: '9999px',
                border: following ? '1px solid #cfd9de' : 'none',
                padding: '8px 16px',
                fontWeight: 'bold',
                background: following ? 'transparent' : '#0f1419',
                color: following ? '#0f1419' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
            }}
        >
            {following ? 'Following' : 'Follow'}
        </button>
    );
};

export const XProfile: React.FC = () => {
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', minHeight: '100%' }}>
            {/* Banner */}
            <div style={{ height: '200px', background: '#cfd9de' }}>
                <img src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop" alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Profile Header */}
            <div style={{ padding: '0 16px', position: 'relative' }}>
                <div style={{
                    width: '134px',
                    height: '134px',
                    borderRadius: '50%',
                    border: '4px solid #fff',
                    overflow: 'hidden',
                    position: 'absolute',
                    top: '-64px'
                }}>
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px' }}>
                    <FollowButton />
                </div>

                <div style={{ marginTop: '40px' }}>
                    <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Léa M.</h1>
                    <div style={{ color: '#536471', fontSize: '15px' }}>@LeaM_99</div>
                </div>

                <div style={{ marginTop: '12px', fontSize: '15px' }}>
                    Passionate about photography and urban exploration. 📸 living life one frame at a time.
                </div>

                <div style={{ display: 'flex', gap: '16px', color: '#536471', fontSize: '15px', marginTop: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={16} /> Paris, France</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><LinkIcon size={16} /> <span style={{ color: '#1d9bf0' }}>instagram.com/lea.m_...</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={16} /> Joined September 2018</div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '14px' }}>
                    <div><span style={{ fontWeight: 'bold', color: '#0f1419' }}>142</span> <span style={{ color: '#536471' }}>Following</span></div>
                    <div><span style={{ fontWeight: 'bold', color: '#0f1419' }}>328</span> <span style={{ color: '#536471' }}>Followers</span></div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #eff3f4', marginTop: '16px' }}>
                {['Posts', 'Replies', 'Media', 'Likes'].map((tab, i) => (
                    <div key={tab} style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '16px 0',
                        cursor: 'pointer',
                        fontWeight: i === 0 ? 'bold' : 'normal',
                        position: 'relative'
                    }}>
                        {tab}
                        {i === 0 && <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '56px', height: '4px', background: '#1d9bf0', borderRadius: '4px' }} />}
                    </div>
                ))}
            </div>

            {/* Tweets */}
            <div>
                {/* Tweet 1 */}
                <Tweet
                    name="Léa M."
                    username="@LeaM_99"
                    time="14h"
                    content="Thinking about checking out that abandoned factory near the river tonight. Anyone been there recently? #urbex #exploration"
                    stats={{ comments: 2, retweets: 0, likes: 5 }}
                />
                {/* Tweet 2 */}
                <Tweet
                    name="Léa M."
                    username="@LeaM_99"
                    time="2d"
                    content="Can't believe it's already October. This year is flying by! 🍂"
                    stats={{ comments: 0, retweets: 1, likes: 12 }}
                />
                {/* Tweet 3 */}
                <Tweet
                    name="Léa M."
                    username="@LeaM_99"
                    time="1w"
                    content="Coffee time ☕️ Best way to start the day."
                    image="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop"
                    stats={{ comments: 1, retweets: 0, likes: 24 }}
                />
            </div>
        </div>
    );
};

const Tweet: React.FC<any> = ({ name, username, time, content, image, stats }) => {
    const [liked, setLiked] = React.useState(false);
    const [retweeted, setRetweeted] = React.useState(false);
    const [likesCount, setLikesCount] = React.useState(stats.likes);
    const [retweetsCount, setRetweetsCount] = React.useState(stats.retweets);

    const handleLike = () => {
        setLiked(!liked);
        setLikesCount((prev: number) => liked ? prev - 1 : prev + 1);
    }

    const handleRetweet = () => {
        setRetweeted(!retweeted);
        setRetweetsCount((prev: number) => retweeted ? prev - 1 : prev + 1);
    }

    return (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #eff3f4', display: 'flex', gap: '12px' }}>
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop" alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '4px', fontSize: '15px' }}>
                    <span style={{ fontWeight: 'bold' }}>{name}</span>
                    <span style={{ color: '#536471' }}>{username}</span>
                    <span style={{ color: '#536471' }}>·</span>
                    <span style={{ color: '#536471' }}>{time}</span>
                </div>
                <div style={{ marginTop: '4px', fontSize: '15px', color: '#0f1419' }}>
                    {content}
                </div>
                {image && (
                    <div style={{ marginTop: '12px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #cfd9de' }}>
                        <img src={image} alt="Tweet media" style={{ width: '100%', display: 'block' }} />
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', color: '#536471', maxWidth: '425px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><MessageCircle size={18} /> {stats.comments}</div>
                    <div onClick={handleRetweet} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: retweeted ? '#00ba7c' : 'inherit' }}><Repeat2 size={18} /> {retweetsCount}</div>
                    <div onClick={handleLike} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: liked ? '#f91880' : 'inherit' }}><Heart size={18} fill={liked ? '#f91880' : 'none'} /> {likesCount}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><Share size={18} /></div>
                </div>
            </div>
        </div>
    );
};
