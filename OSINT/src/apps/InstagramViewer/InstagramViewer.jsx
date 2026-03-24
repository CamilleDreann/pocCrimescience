import { useState } from 'react'
import styles from './InstagramViewer.module.css'

const POSTS = [
  {
    id: 1,
    image: '/image.png',
    caption: 'Lumiere du matin sur les toits de Lille 🌅 #streetphotography #lille #urbanphoto',
    likes: 284,
    comments: 12,
    date: '14 mars',
  },
  {
    id: 2,
    image: null,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    emoji: '🏗️',
    caption: 'Nouveau projet en cours — serie sur le patrimoine industriel du Nord. Stay tuned! #architecture #patrimoine #nord',
    likes: 197,
    comments: 8,
    date: '9 mars',
  },
  {
    id: 3,
    image: null,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    emoji: '🎨',
    caption: 'Expo "Regards Urbains" a la Gare Saint-Sauveur — merci a tous ceux qui sont venus ! #expo #art #lille',
    likes: 342,
    comments: 24,
    date: '2 mars',
  },
  {
    id: 4,
    image: null,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    emoji: '📸',
    caption: 'Le reflet parfait n\'existe p... ah si, en fait. Canal de la Deule au petit matin. #reflection #canal #photography',
    likes: 156,
    comments: 6,
    date: '25 fev',
  },
]

const PROFILE = {
  username: 'julien.caron',
  displayName: 'Julien Caron',
  bio: 'Photographe urbain | Lille\nStreet art & architecture\n📧 julien.caron@gmail.com',
  posts: 127,
  followers: '2,4k',
  following: 843,
  verified: false,
}

export default function InstagramViewer({ username }) {
  const [selectedPost, setSelectedPost] = useState(null)
  const [likedPosts, setLikedPosts] = useState(new Set())

  const toggleLike = (postId) => {
    setLikedPosts(prev => {
      const next = new Set(prev)
      if (next.has(postId)) next.delete(postId)
      else next.add(postId)
      return next
    })
  }

  return (
    <div className={styles.container}>
      {/* Instagram-style top bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <svg className={styles.igLogo} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
          </svg>
          <span className={styles.topBarTitle}>Instagram</span>
        </div>
      </div>

      <div className={styles.scrollContent}>
        {/* Profile header */}
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            <div className={styles.avatarRing}>
              <div className={styles.avatarInner}>JC</div>
            </div>
          </div>
          <div className={styles.profileStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{PROFILE.posts}</span>
              <span className={styles.statLabel}>Publications</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{PROFILE.followers}</span>
              <span className={styles.statLabel}>Abonnes</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{PROFILE.following}</span>
              <span className={styles.statLabel}>Abonnements</span>
            </div>
          </div>
        </div>

        <div className={styles.profileInfo}>
          <span className={styles.displayName}>{PROFILE.displayName}</span>
          <span className={styles.bio}>{PROFILE.bio}</span>
        </div>

        <div className={styles.profileActions}>
          <button className={styles.followBtn}>Suivre</button>
          <button className={styles.messageBtn}>Message</button>
        </div>

        {/* Posts grid */}
        <div className={styles.postsSection}>
          <div className={styles.postsTabs}>
            <button className={`${styles.tabBtn} ${styles.tabActive}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
              </svg>
              <span>PUBLICATIONS</span>
            </button>
          </div>

          <div className={styles.postsGrid}>
            {POSTS.map(post => (
              <div
                key={post.id}
                className={styles.postThumb}
                onClick={() => setSelectedPost(post)}
              >
                {post.image ? (
                  <img src={post.image} alt="" className={styles.postThumbImg} />
                ) : (
                  <div
                    className={styles.postThumbPlaceholder}
                    style={{ background: post.gradient }}
                  >
                    <span className={styles.postThumbEmoji}>{post.emoji}</span>
                  </div>
                )}
                <div className={styles.postThumbOverlay}>
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Post detail modal */}
      {selectedPost && (
        <div className={styles.modal} onClick={() => setSelectedPost(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedPost(null)}>✕</button>

            <div className={styles.modalImage}>
              {selectedPost.image ? (
                <img src={selectedPost.image} alt="" />
              ) : (
                <div className={styles.modalPlaceholder} style={{ background: selectedPost.gradient }}>
                  <span className={styles.modalEmoji}>{selectedPost.emoji}</span>
                </div>
              )}
            </div>

            <div className={styles.modalSide}>
              <div className={styles.modalHeader}>
                <div className={styles.modalAvatar}>JC</div>
                <span className={styles.modalUsername}>{PROFILE.username}</span>
              </div>

              <div className={styles.modalCaption}>
                <span className={styles.modalCaptionUser}>{PROFILE.username}</span>{' '}
                {selectedPost.caption}
              </div>

              <div className={styles.modalDate}>{selectedPost.date}</div>

              <div className={styles.modalActions}>
                <button
                  className={`${styles.actionBtn} ${likedPosts.has(selectedPost.id) ? styles.liked : ''}`}
                  onClick={() => toggleLike(selectedPost.id)}
                >
                  {likedPosts.has(selectedPost.id) ? '❤️' : '🤍'}{' '}
                  {selectedPost.likes + (likedPosts.has(selectedPost.id) ? 1 : 0)}
                </button>
                <button className={styles.actionBtn}>
                  💬 {selectedPost.comments}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
