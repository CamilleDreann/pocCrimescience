import { useState } from 'react'
import styles from './CameraViewer.module.css'
import { completeObjective } from '../../stores/objectivesStore'

const ACCESS_CODE = 'EE58fZ'

function CodeGate({ onUnlock }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (value === ACCESS_CODE) {
      completeObjective('obj-camera-1')
      onUnlock()
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <div className={styles.gate}>
      <div className={styles.gateBox}>
        <div className={styles.gateLock}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        </div>
        <p className={styles.gateTitle}>ACCÈS RESTREINT</p>
        <p className={styles.gateSubtitle}>Entrez le code d'accès pour accéder aux flux caméras</p>
        <form onSubmit={handleSubmit} className={styles.gateForm}>
          <input
            className={`${styles.gateInput} ${error ? styles.gateInputError : ''}`}
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false) }}
            placeholder="Code d'accès"
            autoFocus
          />
          {error && <span className={styles.gateError}>Code incorrect</span>}
          <button type="submit" className={styles.gateBtn}>VALIDER</button>
        </form>
      </div>
    </div>
  )
}

const CAMERAS = [
  { id: 1, label: 'Caméra 01 — Station essence', video: '/cameras/Station essence.mp4' },
  { id: 2, label: 'Caméra 02 — Station essence', video: '/cameras/Station essence 2.mp4' },
  { id: 3, label: 'Caméra 03 — Sortie hôtel', video: '/cameras/sortie_hotel.mp4' },
  { id: 4, label: 'Caméra 04' },
  { id: 5, label: 'Caméra 05' },
  { id: 6, label: 'Caméra 06' },
]

const CameraIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M15 10l4.553-2.069A1 1 0 0121 8.88v6.24a1 1 0 01-1.447.889L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
  </svg>
)

export default function CameraViewer() {
  const [unlocked, setUnlocked] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const selected = CAMERAS.find((c) => c.id === selectedId)

  if (!unlocked) return <CodeGate onUnlock={() => setUnlocked(true)} />

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {CAMERAS.map((cam) => (
          <div
            key={cam.id}
            className={`${styles.card} ${selectedId && cam.id !== selectedId ? styles.dimmed : ''}`}
            onClick={() => setSelectedId(cam.id)}
          >
            <span className={styles.badge}>● EN DIRECT</span>
            {cam.video ? (
              <video
                className={styles.preview}
                src={cam.video}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <div className={styles.icon}><CameraIcon /></div>
            )}
            <span className={styles.label}>{cam.label}</span>
          </div>
        ))}
      </div>

      {selected && (
        <div className={styles.overlay} onClick={() => setSelectedId(null)}>
          <div className={styles.expanded} onClick={(e) => e.stopPropagation()}>
            <span className={styles.badge}>● EN DIRECT</span>
            {selected.video ? (
              <video
                className={styles.video}
                src={selected.video}
                autoPlay
                loop
                controls
              />
            ) : (
              <>
                <div className={styles.icon}><CameraIcon /></div>
                <span className={styles.label}>{selected.label}</span>
              </>
            )}
            <button className={styles.closeBtn} onClick={() => setSelectedId(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  )
}
