import { useMemo, useState, useRef, useEffect } from 'react'
import { useStore } from '@nanostores/react'
import Icon from '../../components/ui/Icon'
import Popup from '../../components/ui/Popup'
import { $messages, markAsRead, setRender } from '../../stores/messagesStore'
import { setObjectives } from '../../stores/objectivesStore'
import styles from './Messaging.module.css'

export default function Messaging() {
  const allMessages = useStore($messages)
  const [selectedId, setSelectedId] = useState(null)
  const [videoOpen, setVideoOpen] = useState(false)
  const [showVideoPopup, setShowVideoPopup] = useState(false)
  const [videoWatched, setVideoWatched] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [buffering, setBuffering] = useState(false)
  const videoRef = useRef(null)

  const openVideo = () => {
    setVideoOpen(true)
    setPlaying(false)
    setCurrentTime(0)
  }

  const closeVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    setVideoOpen(false)
    setPlaying(false)
    setCurrentTime(0)
    setVideoWatched(true)
  }

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
      setPlaying(false)
    } else {
      videoRef.current.play()
      setPlaying(true)
    }
  }

  const handleVideoEnded = () => {
    if (selectedMessage?.onVideoEnd) setRender(selectedMessage.onVideoEnd, true)
    closeVideo()
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration)
  }

  const handleWaiting = () => setBuffering(true)
  const handleCanPlay = () => setBuffering(false)

  const handleSeek = (e) => {
    if (!videoRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const newTime = ratio * duration
    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (videoRef.current) videoRef.current.volume = val
    setMuted(val === 0)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    const newMuted = !muted
    setMuted(newMuted)
    videoRef.current.muted = newMuted
  }


  useEffect(() => {
    if (!videoOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeVideo()
      } else if (e.key === ' ') {
        e.preventDefault()
        if (!videoRef.current) return
        if (playing) {
          videoRef.current.pause()
          setPlaying(false)
        } else {
          videoRef.current.play()
          setPlaying(true)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoOpen, playing])

  const messages = useMemo(() => {
    return allMessages
      .filter(m => m.render)
      .map(m => ({ ...m, date: new Date(m.date) }))
      .sort((a, b) => b.date - a.date)
  }, [allMessages])

  const selectedMessage = messages.find(m => m.id === selectedId)

  const handleSelect = (id) => {
    setSelectedId(id)
    markAsRead(id)
    setVideoWatched(false)
  }

  const formatMsgTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const unreadCount = messages.filter(m => !m.readed).length

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Icon name="mail" size={16} />
          <span>Boîte de réception</span>
          <span className={styles.count}>{unreadCount}</span>
        </div>
        <div className={styles.messageList}>
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`${styles.messageItem} ${selectedId === msg.id ? styles.selected : ''} ${!msg.readed ? styles.unread : ''}`}
              onClick={() => handleSelect(msg.id)}
            >
              <div className={styles.avatar}>{msg.avatar}</div>
              <div className={styles.messagePreview}>
                <div className={styles.messageFrom}>{msg.from}</div>
                <div className={styles.messageSubject}>{msg.subject}</div>
                <div className={styles.messageSnippet}>{msg.body.split('\n')[0]}</div>
              </div>
              <div className={styles.messageTime}>{formatMsgTime(msg.date)}</div>
              {!msg.readed && <div className={styles.unreadDot} />}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.reader}>
        {selectedMessage ? (
          <>
            <div className={styles.readerHeader}>
              <h2 className={styles.readerSubject}>{selectedMessage.subject}</h2>
              <div className={styles.readerMeta}>
                <div className={styles.readerAvatar}>{selectedMessage.avatar}</div>
                <div>
                  <div className={styles.readerFrom}>{selectedMessage.from}</div>
                  <div className={styles.readerRole}>{selectedMessage.role}</div>
                </div>
                <div className={styles.readerDate}>{formatMsgTime(selectedMessage.date)}</div>
              </div>
            </div>
            <div className={styles.readerContent}>
            <div className={styles.readerBody} dangerouslySetInnerHTML={{ __html: selectedMessage.body.replace(/\n/g, '<br/>') }} />
            {selectedMessage.objectives?.length > 0 && (
              <div className={styles.objectiveBox}>
                <ul className={styles.objectiveBoxList}>
                  {selectedMessage.objectives.map((obj, i) => (
                    <li key={obj.id}><b>OBJECTIF {i + 1} :</b> {obj.label}</li>
                  ))}
                </ul>
              </div>
            )}
            </div>
            {(selectedMessage.objectives?.length > 0 || selectedMessage.video) && (
              <div className={styles.readerFooter}>
                <button
                  className={styles.activateObjectives}
                  onClick={() => {
                    if (selectedMessage.objectives?.length > 0) setObjectives(selectedMessage.objectives)
                    if (selectedMessage.video) {
                      if (selectedMessage.skipVideoPopup) {
                        if (selectedMessage.videoObjectives?.length > 0) setObjectives(selectedMessage.videoObjectives)
                        openVideo()
                      } else {
                        setShowVideoPopup(true)
                      }
                    }
                  }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    {selectedMessage.video && !selectedMessage.objectives?.length ? (
                      <path d="M8 5v14l11-7z" />
                    ) : (
                      <>
                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="12" r="2" />
                      </>
                    )}
                  </svg>
                  Lancer la mission
                </button>
                {videoWatched && selectedMessage.video && (
                  <button
                    className={styles.replayVideo}
                    onClick={openVideo}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                    </svg>
                    Relancer la vidéo
                  </button>
                )}
              </div>
            )}
            {videoOpen && selectedMessage?.video && (
              <div className={styles.videoOverlay} onClick={closeVideo}>
                <div className={styles.vlcWindow} onClick={e => e.stopPropagation()}>

                  {/* Barre de titre */}
                  <div className={styles.vlcTitleBar}>
                    <button className={`${styles.vlcTitleBtn} ${styles.vlcClose}`} onClick={closeVideo} title="Fermer">✕</button>
                  </div>

                  {/* Zone vidéo */}
                  <div className={styles.vlcVideoArea}>
                    <video
                      ref={videoRef}
                      className={styles.vlcVideo}
                      src={selectedMessage.video}
                      onEnded={handleVideoEnded}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onWaiting={handleWaiting}
                      onCanPlay={handleCanPlay}
                      onClick={togglePlay}
                    />
                    {buffering && <div className={styles.videoSpinner} />}
                  </div>

                  {/* Barre de progression */}
                  <div className={styles.vlcProgressArea}>
                    <div className={styles.vlcProgress} onClick={handleSeek}>
                      <div
                        className={styles.vlcProgressFill}
                        style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                      />
                    </div>
                  </div>

                  {/* Contrôles */}
                  <div className={styles.vlcControls}>
                    {/* Stop */}
                    <button className={styles.vlcBtn} onClick={() => {
                      if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
                      setPlaying(false); setCurrentTime(0);
                    }} title="Stop">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6 6h12v12H6z"/></svg>
                    </button>

                    {/* Précédent (désactivé) */}
                    <button className={styles.vlcBtn} disabled title="Précédent">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                    </button>

                    {/* Play / Pause */}
                    <button className={styles.vlcBtn} onClick={togglePlay} title={playing ? 'Pause' : 'Lecture'}>
                      {playing
                        ? <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                        : <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M8 5v14l11-7z"/></svg>
                      }
                    </button>

                    {/* Suivant (désactivé) */}
                    <button className={styles.vlcBtn} disabled title="Suivant">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/></svg>
                    </button>

                    <div className={styles.vlcSeparator} />

                    <span className={styles.vlcTime}>
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    {/* Volume */}
                    <div className={styles.vlcVolumeGroup}>
                      <button className={styles.vlcBtn} onClick={toggleMute} title={muted ? 'Activer le son' : 'Muet'}>
                        {muted || volume === 0
                          ? <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 18l1.27 1.27L20.27 18 5.27 3 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                          : <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                        }
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={muted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className={styles.vlcVolumeSlider}
                      />
                    </div>
                  </div>

                </div>
              </div>
            )}
          </>
        ) : (
          <div className={styles.emptyState}>
            <Icon name="mail" size={48} />
            <p>Sélectionnez un message pour le lire</p>
          </div>
        )}
      </div>

      {showVideoPopup && (
        <Popup
          title="Sensibilisation OSINT"
          message="L'appel à témoins a bien été lancé. En attendant les retours de la Brigade, le commandement vous invite à visionner cette courte vidéo.

L'OSINT est une méthode d'investigation redoutable pour retrouver des cibles, mais ne sous-estimez jamais ses dérives : doxing, fuites de données privées et cyberharcèlement sont des menaces réelles liées à la surexposition numérique."
          type="info"
          actions={[
            {
              label: "Lancer la vidéo",
              primary: true,
              onClick: () => {
                setShowVideoPopup(false)
                if (selectedMessage?.videoObjectives?.length > 0) setObjectives(selectedMessage.videoObjectives)
                openVideo()
              }
            }
          ]}
          onClose={() => setShowVideoPopup(false)}
        />
      )}
    </div>
  )
}
