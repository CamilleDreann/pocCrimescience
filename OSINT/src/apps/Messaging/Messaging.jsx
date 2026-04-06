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
                <video
                  className={styles.videoPreview}
                  src={`${selectedMessage.video}#t=0.1`}
                  preload="metadata"
                  onClick={openVideo}
                  title="Cliquer pour ouvrir la vidéo"
                />
                <div className={styles.videoPlayHint} onClick={openVideo}>▶</div>
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

                  <button className={styles.videoCloseBtn} onClick={closeVideo}>✕</button>

                  <div className={`${styles.videoControls} ${showControls ? styles.videoControlsVisible : ''}`}>
                    <div className={styles.videoProgress} onClick={handleSeek}>
                      <div
                        className={styles.videoProgressFill}
                        style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                      />
                    </div>

                    <div className={styles.videoControlsRow}>
                      <button className={styles.videoCtrlBtn} onClick={togglePlay}>
                        {playing ? '⏸' : '▶'}
                      </button>

                      <button className={styles.videoCtrlBtn} onClick={toggleMute}>
                        {muted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
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
                        ⛶
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
