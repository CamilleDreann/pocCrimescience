import { useMemo, useState, useRef, useEffect } from 'react'
import { useStore } from '@nanostores/react'
import Icon from '../../components/ui/Icon'
import { $messages, markAsRead } from '../../stores/messagesStore'
import styles from './Messaging.module.css'

export default function Messaging() {
  const allMessages = useStore($messages)
  const [selectedId, setSelectedId] = useState(null)
  const [videoOpen, setVideoOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [buffering, setBuffering] = useState(false)
  const videoRef = useRef(null)
  const controlsTimerRef = useRef(null)

  const openVideo = () => {
    setVideoOpen(true)
    setPlaying(false)
    setCurrentTime(0)
    setShowControls(true)
  }

  const closeVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    setVideoOpen(false)
    setPlaying(false)
    setCurrentTime(0)
    clearTimeout(controlsTimerRef.current)
  }

  const scheduleHideControls = () => {
    clearTimeout(controlsTimerRef.current)
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000)
  }

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
      setPlaying(false)
      setShowControls(true)
      clearTimeout(controlsTimerRef.current)
    } else {
      videoRef.current.play()
      setPlaying(true)
      scheduleHideControls()
    }
  }

  const handleVideoEnded = () => {
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

  const handleFullscreen = () => {
    if (videoRef.current) videoRef.current.requestFullscreen?.()
  }

  const handleOverlayMouseMove = () => {
    setShowControls(true)
    if (playing) scheduleHideControls()
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
          setShowControls(true)
          clearTimeout(controlsTimerRef.current)
        } else {
          videoRef.current.play()
          setPlaying(true)
          scheduleHideControls()
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
            <div className={styles.readerBody} dangerouslySetInnerHTML={{ __html: selectedMessage.body.replace(/\n/g, '<br/>') }} />
            {selectedMessage.video && (
              <div className={styles.videoWrapper}>
                <div className={styles.videoThumb} onClick={openVideo}>
                  <video
                    className={styles.videoPreview}
                    src={`${selectedMessage.video}#t=0.1`}
                    preload="metadata"
                  />
                  <div className={styles.videoPlayHint}>
                    <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}
            {videoOpen && selectedMessage?.video && (
              <div
                className={styles.videoOverlay}
                onClick={closeVideo}
                onMouseMove={handleOverlayMouseMove}
              >
                <div className={styles.videoOverlayInner} onClick={e => e.stopPropagation()}>
                  <video
                    ref={videoRef}
                    className={styles.videoFull}
                    src={selectedMessage.video}
                    onEnded={handleVideoEnded}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onWaiting={handleWaiting}
                    onCanPlay={handleCanPlay}
                    onClick={togglePlay}
                  />

                  {buffering && <div className={styles.videoSpinner} />}

                  <button className={styles.videoCloseBtn} onClick={closeVideo}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>

                  <div className={`${styles.videoControls} ${showControls ? styles.videoControlsVisible : ''}`}>
                    <div className={styles.videoProgress} onClick={handleSeek}>
                      <div
                        className={styles.videoProgressFill}
                        style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                      />
                    </div>

                    <div className={styles.videoControlsRow}>
                      <button className={styles.videoCtrlBtn} onClick={togglePlay}>
                        {playing
                          ? <svg viewBox="0 0 24 24" fill="white" width="18" height="18"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                          : <svg viewBox="0 0 24 24" fill="white" width="18" height="18"><path d="M8 5v14l11-7z"/></svg>
                        }
                      </button>

                      <button className={styles.videoCtrlBtn} onClick={toggleMute}>
                        {muted || volume === 0
                          ? <svg viewBox="0 0 24 24" fill="white" width="18" height="18"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 18l1.27 1.27L20.27 18 5.27 3 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                          : volume < 0.5
                          ? <svg viewBox="0 0 24 24" fill="white" width="18" height="18"><path d="M18.5 12A4.5 4.5 0 0 0 16 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>
                          : <svg viewBox="0 0 24 24" fill="white" width="18" height="18"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                        }
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={muted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className={styles.videoVolumeSlider}
                      />

                      <span className={styles.videoTime}>
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>

                      <button className={styles.videoCtrlBtn} onClick={handleFullscreen} style={{ marginLeft: 'auto' }}>
                        <svg viewBox="0 0 24 24" fill="white" width="18" height="18"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                      </button>
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
    </div>
  )
}
