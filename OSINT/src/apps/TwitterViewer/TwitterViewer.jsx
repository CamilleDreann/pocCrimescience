import { useState } from 'react'
import { useOS } from '../../context/useOS'
import { addCustomNode, uid } from '../../stores/graphStore'
import styles from './TwitterViewer.module.css'

function getInitials(username) {
  const clean = username.replace(/^@/, '')
  const parts = clean.split(/[._]/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return clean.slice(0, 2).toUpperCase()
}

export default function TwitterViewer({ profile }) {
  const { addNotification } = useOS()
  const [selectedTweet, setSelectedTweet] = useState(null)

  const initials = getInitials(profile.username)
  const tweets = profile.tweets ?? []

  const handleAddToGraph = () => {
    addCustomNode({
      id: uid(),
      type: 'person',
      label: profile.username,
      data: {
        platform: 'Twitter',
        username: profile.username,
        url: profile.url,
        bio: profile.bio,
        found: true,
        tweets: profile.tweets,
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
          <svg className={styles.xLogo} viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span className={styles.topBarTitle}>X / Twitter</span>
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
            <div className={styles.profileBio}>{profile.bio}</div>
            <div className={styles.profileStats}>
              {profile.followers && (
                <span className={styles.statChip}><strong>{profile.followers}</strong> abonnés</span>
              )}
              {profile.following !== undefined && (
                <span className={styles.statChip}><strong>{profile.following}</strong> abonnements</span>
              )}
              {profile.tweetsCount !== undefined && (
                <span className={styles.statChip}><strong>{profile.tweetsCount}</strong> tweets</span>
              )}
            </div>
          </div>
          <div className={styles.profileActions}>
            <button className={styles.followBtn}>Suivre</button>
            <button className={styles.messageBtn}>Message</button>
            <button className={styles.addGraphBtn} onClick={handleAddToGraph}>
              + Ajouter le profil
            </button>
          </div>
        </div>

        {/* Tweets */}
        <div className={styles.tweetsSection}>
          {tweets.map(tweet => (
            <div key={tweet.id} className={styles.tweetCard} onClick={() => setSelectedTweet(tweet)}>
              <div className={styles.tweetHeader}>
                <div className={styles.tweetAvatar}>{initials}</div>
                <div className={styles.tweetMeta}>
                  <span className={styles.tweetAuthor}>{profile.username}</span>
                  <span className={styles.tweetDate}>{tweet.date}</span>
                </div>
              </div>
              <div className={styles.tweetContent}>{tweet.content}</div>
              <div className={styles.tweetStats}>
                <span>❤️ {tweet.likes}</span>
                <span>🔁 {tweet.reposts}</span>
                <span>💬 {tweet.replies}</span>
              </div>
              {tweet.comments && tweet.comments.length > 0 && (
                <div className={styles.repliesPreview}>
                  {tweet.comments.slice(0, 2).map((c, i) => (
                    <div key={i} className={styles.replyItem}>
                      <span className={styles.replyUser}>{c.username}</span>
                      <span className={styles.replyText}>{c.text}</span>
                    </div>
                  ))}
                  {tweet.comments.length > 2 && (
                    <div className={styles.moreReplies}>
                      + {tweet.comments.length - 2} réponses
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tweet detail modal */}
      {selectedTweet && (
        <div className={styles.modal} onClick={() => setSelectedTweet(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedTweet(null)}>✕</button>
            <div className={styles.modalHeader}>
              <div className={styles.modalAvatar}>{initials}</div>
              <div>
                <div className={styles.modalAuthor}>{profile.username}</div>
                <div className={styles.modalDate}>{selectedTweet.date}</div>
              </div>
            </div>
            <div className={styles.modalBody}>{selectedTweet.content}</div>
            <div className={styles.modalStats}>
              <span>❤️ {selectedTweet.likes}</span>
              <span>🔁 {selectedTweet.reposts}</span>
              <span>💬 {selectedTweet.replies}</span>
            </div>
            {selectedTweet.comments && selectedTweet.comments.length > 0 && (
              <div className={styles.modalReplies}>
                <div className={styles.repliesTitle}>Réponses</div>
                {selectedTweet.comments.map((c, i) => (
                  <div key={i} className={styles.modalReplyItem}>
                    <span className={styles.modalReplyUser}>{c.username}</span>
                    <span className={styles.modalReplyText}>{c.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
