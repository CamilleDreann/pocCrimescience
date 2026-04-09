import { useState } from 'react'
import Popup from '../../components/ui/Popup'
import styles from './InstagramViewer.module.css'

function getInitials(username) {
  // "@marie.dpt" -> "MD", "@lucas_mrt" -> "LM", "@chez_julien_mrs" -> "CJ"
  const clean = username.replace(/^@/, '')
  const parts = clean.split(/[._]/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return clean.slice(0, 2).toUpperCase()
}

export default function InstagramViewer({ profile }) {
  const [selectedPost, setSelectedPost] = useState(null)
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [warningPopup, setWarningPopup] = useState(null)

  const initials = getInitials(profile.username)
  const posts = profile.posts ?? []

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
              <div className={styles.avatarInner}>{initials}</div>
            </div>
          </div>
          <div className={styles.profileStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{profile.postsCount ?? posts.length}</span>
              <span className={styles.statLabel}>Publications</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{profile.followers ?? '0'}</span>
              <span className={styles.statLabel}>Abonnes</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{profile.following ?? 0}</span>
              <span className={styles.statLabel}>Abonnements</span>
            </div>
          </div>
        </div>

        <div className={styles.profileInfo}>
          <span className={styles.displayName}>{profile.username}</span>
          <span className={styles.bio}>{profile.bio}</span>
        </div>

        <div className={styles.profileActions}>
          <button className={styles.followBtn} onClick={() => setWarningPopup('follow')}>Suivre</button>
          <button className={styles.messageBtn} onClick={() => setWarningPopup('message')}>Message</button>
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
            {posts.map(post => (
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
                  <span><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{display:'inline',verticalAlign:'middle',marginRight:3}}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> {post.likes}</span>
                  <span><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{display:'inline',verticalAlign:'middle',marginRight:3}}><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg> {post.comments}</span>
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
                <div className={styles.modalAvatar}>{initials}</div>
                <span className={styles.modalUsername}>{profile.username}</span>
              </div>

              <div className={styles.modalCaption}>
                <span className={styles.modalCaptionUser}>{profile.username}</span>{' '}
                {selectedPost.caption}
              </div>

              <div className={styles.modalDate}>{selectedPost.date}</div>

              <div className={styles.modalActions}>
                <button
                  className={`${styles.actionBtn} ${likedPosts.has(selectedPost.id) ? styles.liked : ''}`}
                  onClick={() => toggleLike(selectedPost.id)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={likedPosts.has(selectedPost.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" style={{display:'inline',verticalAlign:'middle',marginRight:4}}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>{' '}
                  {selectedPost.likes + (likedPosts.has(selectedPost.id) ? 1 : 0)}
                </button>
                <button className={styles.actionBtn}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{display:'inline',verticalAlign:'middle',marginRight:4}}><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg> {selectedPost.comments}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {warningPopup && (
        <Popup
          type="error"
          title="Action interdite en enquête"
          message={
            warningPopup === 'follow'
              ? "Suivre ce profil alerterait la cible qu'elle est observée. Dans le cadre d'une enquête OSINT, vous devez rester passif."
              : "Envoyer un message alerterait la cible qu'elle est recherchée. Dans le cadre d'une enquête OSINT, vous devez rester passif."
          }
          onClose={() => setWarningPopup(null)}
        />
      )}
    </div>
  )
}
