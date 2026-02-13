import { useState, useRef, useEffect, useCallback } from 'react'
import './BraindanceEditor.css'

const LAYERS = [
  { id: 'visual', name: 'Visual Layer', icon: '◉', color: '#00f0ff' },
  { id: 'thermal', name: 'Thermal Layer', icon: '≋', color: '#ff3d00' },
  { id: 'sound', name: 'Sound Layer', icon: '◫', color: '#39ff14' },
]

// Simulated clues data - in real app this would come from props or API
const CLUES = [
  { id: 1, time: 5, duration: 3, layer: 'visual', label: 'Weapon detected' },
  { id: 2, time: 12, duration: 2, layer: 'thermal', label: 'Heat signature' },
  { id: 3, time: 18, duration: 4, layer: 'sound', label: 'Gunshot audio' },
  { id: 4, time: 22, duration: 2, layer: 'visual', label: 'Face visible' },
]

function BraindanceEditor({ videoSrc = '/preuve1.mp4' }) {
  const videoRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const animationRef = useRef(null)
  const sourceCreatedRef = useRef(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [activeLayer, setActiveLayer] = useState('visual')
  const [scannedClues, setScannedClues] = useState([])
  const [currentClue, setCurrentClue] = useState(null)
  const [showInfo, setShowInfo] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)
  const [audioData, setAudioData] = useState({ left: new Uint8Array(64), right: new Uint8Array(64) })

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Handle video time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  // Handle video loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      setIsLoaded(true)
    }
  }

  // Sync play state with video
  const handlePlay = () => {
    setIsPlaying(true)
    // Initialize audio analyser on first play
    if (!sourceCreatedRef.current && videoRef.current) {
      try {
        const AudioCtx = window.AudioContext || (window).webkitAudioContext
        const audioContext = new AudioCtx()
        const analyser = audioContext.createAnalyser()
        analyser.fftSize = 256
        analyser.smoothingTimeConstant = 0.8

        const source = audioContext.createMediaElementSource(videoRef.current)
        source.connect(analyser)
        analyser.connect(audioContext.destination)

        audioContextRef.current = audioContext
        analyserRef.current = analyser
        sourceCreatedRef.current = true
      } catch (e) {
        console.warn('Audio analyser initialization failed:', e)
      }
    }
  }
  const handlePause = () => setIsPlaying(false)
  const handleEnded = () => setIsPlaying(false)

  // Play/Pause toggle
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [])

  // Frame step
  const stepFrame = useCallback((direction) => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime += direction * (1 / 30)
    }
  }, [])

  // Seek to position
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    const newTime = pos * duration
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
    }
    setCurrentTime(newTime)
  }

  // Scan current clue
  const scanClue = useCallback(() => {
    if (currentClue && !scannedClues.includes(currentClue.id)) {
      setScannedClues(prev => [...prev, currentClue.id])
    }
  }, [currentClue, scannedClues])

  // Change playback speed
  const cycleSpeed = () => {
    const speeds = [0.25, 0.5, 1, 2]
    const currentIndex = speeds.indexOf(playbackSpeed)
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length]
    setPlaybackSpeed(nextSpeed)
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed
    }
  }

  // Check for clues at current time
  useEffect(() => {
    const activeClue = CLUES.find(
      (clue) =>
        clue.layer === activeLayer &&
        currentTime >= clue.time &&
        currentTime <= clue.time + clue.duration &&
        !scannedClues.includes(clue.id)
    )
    setCurrentClue(activeClue || null)
  }, [currentTime, activeLayer, scannedClues])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'KeyE':
          scanClue()
          break
        case 'ArrowLeft':
          stepFrame(-1)
          break
        case 'ArrowRight':
          stepFrame(1)
          break
        case 'Digit1':
          setActiveLayer('visual')
          break
        case 'Digit2':
          setActiveLayer('thermal')
          break
        case 'Digit3':
          setActiveLayer('sound')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, scanClue, stepFrame])

  // Get layer filter style
  const getLayerFilter = () => {
    switch (activeLayer) {
      case 'thermal':
        return 'hue-rotate(180deg) saturate(2) contrast(1.2)'
      default:
        return 'none'
    }
  }


  // Audio visualization loop
  useEffect(() => {
    if (activeLayer !== 'sound') {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      return
    }

    const animate = () => {
      if (analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyserRef.current.getByteFrequencyData(dataArray)

        // Split into left and right channels (simulated stereo)
        const half = Math.floor(bufferLength / 2)
        const left = dataArray.slice(0, half)
        const right = dataArray.slice(half).reverse()

        setAudioData({ left, right })
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [activeLayer])

  // Resume audio context on play
  useEffect(() => {
    if (isPlaying && audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume()
    }
  }, [isPlaying])

  return (
    <div className="braindance-container">
      {/* Header */}
      <div className="braindance-header">
        <div className="braindance-title">
          <span className="bd-icon">◈</span>
          BRAINDANCE EDITOR
        </div>
        <div className="braindance-header-info">
          <span className="bd-status">● REC</span>
          <span className="bd-quality">HD 1080p</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="braindance-main">
        {/* Left Panel - Layer Selector */}
        <div className="bd-panel bd-panel-left">
          <div className="bd-panel-header">
            <span className="bd-label">LAYER:</span>
            <span className="bd-value">{activeLayer.toUpperCase()}</span>
          </div>
          <div className="bd-layer-stats">
            <span>◈ 34.2% ST.MIX 02.1 MN1.4 → 1.27</span>
          </div>

          <div className="bd-layer-selector">
            <div className="bd-selector-header">INDICATES CURRENTLY SELECTED LAYER</div>
            {LAYERS.map((layer) => (
              <button
                key={layer.id}
                className={`bd-layer-btn ${activeLayer === layer.id ? 'active' : ''}`}
                onClick={() => setActiveLayer(layer.id)}
                style={{ '--layer-color': layer.color }}
              >
                <span className="bd-layer-icon">{layer.icon}</span>
                {layer.name}
              </button>
            ))}
          </div>

          <div className="bd-scanned-clues">
            <div className="bd-selector-header">SCANNED CLUES ({scannedClues.length}/{CLUES.length})</div>
            {CLUES.filter(c => scannedClues.includes(c.id)).map(clue => (
              <div key={clue.id} className="bd-scanned-item" style={{ '--layer-color': LAYERS.find(l => l.id === clue.layer)?.color }}>
                <span className="bd-scanned-icon">✓</span>
                {clue.label}
              </div>
            ))}
          </div>
        </div>

        {/* Center - Video Viewport */}
        <div className="bd-viewport">
          {/* Timeline */}
          <div className="bd-timeline-container">
            <div className="bd-timeline" onClick={handleSeek}>
              {/* Clue markers */}
              {CLUES.map((clue) => (
                <div
                  key={clue.id}
                  className={`bd-clue-marker ${clue.layer === activeLayer ? 'active' : ''} ${scannedClues.includes(clue.id) ? 'scanned' : ''}`}
                  style={{
                    left: `${(clue.time / duration) * 100}%`,
                    width: `${(clue.duration / duration) * 100}%`,
                    '--clue-color': LAYERS.find(l => l.id === clue.layer)?.color
                  }}
                />
              ))}
              {/* Playhead */}
              <div
                className="bd-playhead"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              >
                <div className="bd-playhead-time">{formatTime(currentTime)}</div>
              </div>
            </div>
            <div className="bd-timeline-marks">
              {[0, 25, 50, 75, 100].map(percent => (
                <span key={percent}>{formatTime((percent / 100) * duration)}</span>
              ))}
            </div>
          </div>

          {/* Video Area */}
          <div className="bd-video-area">
            <video
              ref={videoRef}
              className="bd-video"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleEnded}
              style={{
                filter: getLayerFilter(),
                opacity: activeLayer === 'sound' ? 0 : 1
              }}
              preload="metadata"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>

            {/* Sound Layer Visualization */}
            {activeLayer === 'sound' && (
              <div className="bd-sound-visualizer">
                <div className="bd-sound-header">
                  <span className="bd-sound-label">AUDIO ANALYSIS</span>
                  <span className="bd-sound-channels">STEREO 48kHz</span>
                </div>

                {/* Track 1 - Left Channel */}
                <div className="bd-audio-track">
                  <div className="bd-track-label">
                    <span className="bd-track-name">L</span>
                    <span className="bd-track-info">TRACK 01</span>
                  </div>
                  <div className="bd-waveform">
                    {Array.from(audioData.left).map((value, i) => (
                      <div
                        key={`l-${i}`}
                        className="bd-bar"
                        style={{
                          height: `${(value / 255) * 100}%`,
                          backgroundColor: `hsl(${140 + (value / 255) * 40}, 100%, ${50 + (value / 255) * 20}%)`
                        }}
                      />
                    ))}
                  </div>
                  <div className="bd-track-meter">
                    <div
                      className="bd-meter-fill"
                      style={{
                        width: `${Math.max(...Array.from(audioData.left)) / 255 * 100}%`
                      }}
                    />
                  </div>
                </div>

                {/* Track 2 - Right Channel */}
                <div className="bd-audio-track">
                  <div className="bd-track-label">
                    <span className="bd-track-name">R</span>
                    <span className="bd-track-info">TRACK 02</span>
                  </div>
                  <div className="bd-waveform bd-waveform-inverted">
                    {Array.from(audioData.right).map((value, i) => (
                      <div
                        key={`r-${i}`}
                        className="bd-bar"
                        style={{
                          height: `${(value / 255) * 100}%`,
                          backgroundColor: `hsl(${180 + (value / 255) * 40}, 100%, ${50 + (value / 255) * 20}%)`
                        }}
                      />
                    ))}
                  </div>
                  <div className="bd-track-meter">
                    <div
                      className="bd-meter-fill bd-meter-cyan"
                      style={{
                        width: `${Math.max(...Array.from(audioData.right)) / 255 * 100}%`
                      }}
                    />
                  </div>
                </div>

                <div className="bd-sound-footer">
                  <span>◈ WAVEFORM ANALYSIS</span>
                  <span>{formatTime(currentTime)}</span>
                </div>
              </div>
            )}

            {/* Scan overlay */}
            <div className="bd-scan-overlay">
              <div className="bd-scan-grid" />
              <div className="bd-scan-lines" />
              {activeLayer === 'thermal' && <div className="bd-thermal-overlay" />}
            </div>

            {/* Clue highlight */}
            {currentClue && (
              <div className="bd-clue-highlight">
                <div className="bd-clue-box">
                  <span className="bd-clue-label">{currentClue.label}</span>
                  <button className="bd-scan-btn" onClick={scanClue}>
                    SCAN [E]
                  </button>
                </div>
              </div>
            )}

            {/* Center indicator */}
            <div className="bd-center-indicator">
              <svg viewBox="0 0 100 100" className="bd-indicator-svg">
                <circle cx="50" cy="50" r="45" className="bd-indicator-ring" />
                <circle cx="50" cy="50" r="5" className="bd-indicator-dot" />
              </svg>
            </div>
          </div>

          {/* Controls */}
          <div className="bd-controls">
            <div className="bd-controls-left">
              <button className="bd-ctrl-btn" onClick={() => stepFrame(-1)}>
                ⏮
              </button>
              <button className="bd-ctrl-btn bd-play-btn" onClick={togglePlay}>
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button className="bd-ctrl-btn" onClick={() => stepFrame(1)}>
                ⏭
              </button>
              <button className="bd-ctrl-btn bd-speed-btn" onClick={cycleSpeed}>
                {playbackSpeed}x
              </button>
            </div>
            <div className="bd-controls-center">
              <span className="bd-time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <div className="bd-controls-right">
              <button
                className={`bd-ctrl-btn ${showInfo ? 'active' : ''}`}
                onClick={() => setShowInfo(!showInfo)}
              >
                ℹ
              </button>
              <button className="bd-ctrl-btn bd-close-btn">
                ✕ CLOSE
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Info */}
        {showInfo && (
          <div className="bd-panel bd-panel-right">
            <div className="bd-info-header">THE INFORMATION</div>
            <div className="bd-info-mission">
              <span className="bd-mission-icon">!</span>
              Play the recording until you spot the gun.
            </div>

            <div className="bd-info-section">
              <div className="bd-info-preview">
                <div className="bd-preview-image">
                  <div className="bd-preview-timeline" />
                </div>
              </div>
              <p className="bd-info-text">
                Bold sections on the track indicate a scannable clue.
                The clue will be highlighted for the duration of the
                sequence if the editor is set to the correct layer.
              </p>
            </div>

            <div className="bd-info-section">
              <p className="bd-info-text">
                Clues may overlap each other. The spot where they
                overlap on the recording track will be especially
                bright. After being successfully scanned, clues
                disappear from the track.
              </p>
            </div>

            <div className="bd-dialog">
              <span className="bd-dialog-name">Judy:</span>
              <span className="bd-dialog-text">OK, right here.</span>
            </div>

            <div className="bd-watermark">◈</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BraindanceEditor
