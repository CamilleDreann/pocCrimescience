import { useState } from 'react'
import styles from './CameraViewer.module.css'

const CAMERAS = [
  { id: 1, label: 'Caméra 01' },
  { id: 2, label: 'Caméra 02' },
  { id: 3, label: 'Caméra 03' },
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
  const [selectedId, setSelectedId] = useState(null)
  const selected = CAMERAS.find((c) => c.id === selectedId)

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
            <div className={styles.icon}><CameraIcon /></div>
            <span className={styles.label}>{cam.label}</span>
          </div>
        ))}
      </div>

      {selected && (
        <div className={styles.overlay} onClick={() => setSelectedId(null)}>
          <div className={styles.expanded} onClick={(e) => e.stopPropagation()}>
            <span className={styles.badge}>● EN DIRECT</span>
            <div className={styles.icon}><CameraIcon /></div>
            <span className={styles.label}>{selected.label}</span>
            <button className={styles.closeBtn} onClick={() => setSelectedId(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  )
}
