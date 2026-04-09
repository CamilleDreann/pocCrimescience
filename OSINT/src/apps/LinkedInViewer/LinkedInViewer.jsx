import { useState } from 'react'
import { useOS } from '../../context/useOS'
import { addCustomNode, uid } from '../../stores/graphStore'
import Popup from '../../components/ui/Popup'
import styles from './LinkedInViewer.module.css'

function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export default function LinkedInViewer({ profile }) {
  const { addNotification } = useOS()
  const [selectedPost, setSelectedPost] = useState(null)
  const [expanded, setExpanded] = useState(new Set())
  const [warningPopup, setWarningPopup] = useState(null)

  const initials = getInitials(profile.username)
  const posts = profile.posts ?? []

  const toggleExpand = (postId, e) => {
    e.stopPropagation()
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(postId)) next.delete(postId)
      else next.add(postId)
      return next
    })
  }

  const handleAddToGraph = () => {
    addCustomNode({
      id: uid(),
      type: 'person',
      label: profile.username,
      data: {
        platform: 'LinkedIn',
        username: profile.username,
        url: profile.url,
        bio: profile.bio,
        found: true,
        posts: profile.posts,
      },
      x: 300 + Math.random() * 200,
      y: 200 + Math.random() * 200,
    })
    addNotification({
      title: 'Profil ajouté',
      message: `${profile.username} ajouté au graphe`,
      type: 'success',
    })
  }

  return (
    <div className={styles.container}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <svg className={styles.liLogo} viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M20.447 20.452H16.89v-5.569c0-1.327-.024-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.977 1.977 0 01-1.972-1.972 1.977 1.977 0 011.972-1.972 1.977 1.977 0 011.972 1.972 1.977 1.977 0 01-1.972 1.972zm1.971 13.019H3.366V9h3.942v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span className={styles.topBarTitle}>LinkedIn</span>
        </div>
      </div>

      <div className={styles.scrollContent}>
        {/* Profile header */}
        <div className={styles.profileCard}>
          <div className={styles.profileBanner} />
          <div className={styles.profileAvatarWrap}>
            <div className={styles.profileAvatar}>{initials}</div>
          </div>
          <div className={styles.profileMeta}>
            <div className={styles.profileName}>{profile.username}</div>
            {profile.title && <div className={styles.profileTitle}>{profile.title}</div>}
            {profile.company && (
              <div className={styles.profileCompany}>
                <span className={styles.companyBadge}>{profile.company}</span>
              </div>
            )}
            <div className={styles.profileBio}>{profile.bio}</div>
            <div className={styles.profileStats}>
              {profile.connections && (
                <span className={styles.statChip}><strong>{profile.connections}</strong> connexions</span>
              )}
              {profile.postsCount && (
                <span className={styles.statChip}><strong>{profile.postsCount}</strong> publications</span>
              )}
            </div>
          </div>
          <div className={styles.profileActions}>
            <button className={styles.connectBtn} onClick={() => setWarningPopup('connect')}>Se connecter</button>
            <button className={styles.messageBtn} onClick={() => setWarningPopup('message')}>Message</button>
            <button className={styles.addGraphBtn} onClick={() => setWarningPopup('graph')}>
              + Ajouter le profil
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className={styles.postsSection}>
          <div className={styles.sectionTitle}>Publications</div>
          {posts.map(post => {
            const isExpanded = expanded.has(post.id)
            const isLong = post.content.length > 220
            const displayContent = isLong && !isExpanded
              ? post.content.slice(0, 220) + '…'
              : post.content

            return (
              <div key={post.id} className={styles.postCard} onClick={() => setSelectedPost(post)}>
                <div className={styles.postHeader}>
                  <div className={styles.postAvatar}>{initials}</div>
                  <div className={styles.postMeta}>
                    <span className={styles.postAuthor}>{profile.username}</span>
                    <span className={styles.postDate}>{post.date}</span>
                  </div>
                </div>
                {post.title && <div className={styles.postTitle}>{post.title}</div>}
                <div className={styles.postContent}>{displayContent}</div>
                {isLong && (
                  <button
                    className={styles.seeMoreBtn}
                    onClick={e => toggleExpand(post.id, e)}
                  >
                    {isExpanded ? 'Voir moins' : 'Voir plus'}
                  </button>
                )}
                {post.image && (
                  <img src={post.image} alt="" className={styles.postImage} />
                )}
                {post.hashtags && (
                  <div className={styles.hashtags}>
                    {post.hashtags.map(h => (
                      <span key={h} className={styles.hashtag}>{h}</span>
                    ))}
                  </div>
                )}
                <div className={styles.postStats}>
                  <span><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{display:'inline',verticalAlign:'middle',marginRight:3}}><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg> {post.likes}</span>
                  <span><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{display:'inline',verticalAlign:'middle',marginRight:3}}><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg> {post.comments}</span>
                  <span><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{display:'inline',verticalAlign:'middle',marginRight:3}}><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg> {post.shares}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Post detail modal */}
      {selectedPost && (
        <div className={styles.modal} onClick={() => setSelectedPost(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedPost(null)}>✕</button>
            <div className={styles.modalHeader}>
              <div className={styles.modalAvatar}>{initials}</div>
              <div>
                <div className={styles.modalAuthor}>{profile.username}</div>
                {profile.title && <div className={styles.modalTitle}>{profile.title}</div>}
                <div className={styles.modalDate}>{selectedPost.date}</div>
              </div>
            </div>
            {selectedPost.title && <div className={styles.modalPostTitle}>{selectedPost.title}</div>}
            {selectedPost.image && (
              <img src={selectedPost.image} alt="" className={styles.modalImage} />
            )}
            <div className={styles.modalBody}>{selectedPost.content}</div>
            {selectedPost.hashtags && (
              <div className={styles.hashtags}>
                {selectedPost.hashtags.map(h => (
                  <span key={h} className={styles.hashtag}>{h}</span>
                ))}
              </div>
            )}
            <div className={styles.modalStats}>
              <span><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{display:'inline',verticalAlign:'middle',marginRight:3}}><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg> {selectedPost.likes} j'aime</span>
              <span><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{display:'inline',verticalAlign:'middle',marginRight:3}}><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg> {selectedPost.comments} commentaires</span>
              <span><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{display:'inline',verticalAlign:'middle',marginRight:3}}><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg> {selectedPost.shares} partages</span>
            </div>
          </div>
        </div>
      )}

      {warningPopup && (
        <Popup
          type={warningPopup === 'graph' ? 'warning' : 'error'}
          title="Action interdite en enquête"
          message={
            warningPopup === 'connect'
              ? "Se connecter à ce profil alerterait la cible qu'elle est observée. Dans le cadre d'une enquête OSINT, vous devez rester passif."
              : warningPopup === 'message'
              ? "Envoyer un message alerterait la cible qu'elle est recherchée. Dans le cadre d'une enquête OSINT, vous devez rester passif."
              : "Ajouter ce profil au graphe est une action locale, mais assurez-vous de ne pas interagir directement avec la cible."
          }
          onClose={() => setWarningPopup(null)}
          actions={warningPopup === 'graph' ? [
            { label: 'Annuler', onClick: () => setWarningPopup(null) },
            { label: 'Ajouter quand même', primary: true, onClick: () => { handleAddToGraph(); setWarningPopup(null) } },
          ] : undefined}
        />
      )}
    </div>
  )
}
