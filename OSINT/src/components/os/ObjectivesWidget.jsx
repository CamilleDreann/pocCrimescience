import { useState } from 'react'
import { useStore } from '@nanostores/react'
import { $objectives, $widgetPulse, completeObjective } from '../../stores/objectivesStore'
import { useOS } from '../../context/useOS'
import styles from './ObjectivesWidget.module.css'
import ArrestOverlay from './ArrestOverlay'

const CORRECT_PLATE = 'RRARX29'

export default function ObjectivesWidget() {
  const objectives = useStore($objectives)
  const pulse = useStore($widgetPulse)
  const [expanded, setExpanded] = useState(false)
  const [plateModal, setPlateModal] = useState(false)
  const [plateValue, setPlateValue] = useState('')
  const [plateError, setPlateError] = useState(false)
  const [showArrest, setShowArrest] = useState(false)
  const { startScreenshot, openApp } = useOS()

  function formatPlate(raw) {
    const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (clean.length <= 2) return clean
    if (clean.length <= 5) return clean.slice(0, 2) + '-' + clean.slice(2)
    return clean.slice(0, 2) + '-' + clean.slice(2, 5) + '-' + clean.slice(5, 7)
  }

  function handlePlateChange(e) {
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    setPlateValue(formatPlate(raw))
    setPlateError(false)
  }

  function handlePlateSubmit() {
    const normalized = plateValue.replace(/-/g, '')
    if (normalized !== CORRECT_PLATE) {
      setPlateError(true)
      setTimeout(() => setPlateError(false), 600)
      return
    }
    completeObjective('obj-plate-1')
    setPlateModal(false)
    setPlateValue('')
    setShowArrest(true)
  }

  if (objectives.length === 0) return null

  const completed = objectives.filter(o => o.completed).length
  const allDone = objectives.length > 0 && completed === objectives.length

  return (
    <>
    {plateModal && (
      <div className={styles.plateOverlay} onClick={() => setPlateModal(false)}>
        <div className={styles.plateModal} onClick={e => e.stopPropagation()}>
          <div className={styles.plateModalTitle}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg> Saisir la plaque d'immatriculation</div>
          <div className={styles.plateInputWrapper}>
            <div className={`${styles.plateFrame} ${plateError ? styles.plateFrameError : ''}`}>
              <span className={styles.plateFlagStrip}>F</span>
              <input
                className={styles.plateInput}
                value={plateValue}
                onChange={handlePlateChange}
                onKeyDown={e => e.key === 'Enter' && handlePlateSubmit()}
                maxLength={9}
                autoFocus
                placeholder="AA-000-BB"
                spellCheck={false}
              />
            </div>
          </div>
          <div className={styles.plateModalActions}>
            <button className={styles.plateCancel} onClick={() => setPlateModal(false)}>Annuler</button>
            <button className={styles.plateConfirm} onClick={handlePlateSubmit}>Valider</button>
          </div>
        </div>
      </div>
    )}
    <div className={styles.wrapper}>
      <button
        data-objectives-badge
        className={`${styles.badge} ${pulse ? styles.badgePulse : ''}`}
        onClick={() => setExpanded(e => !e)}
        onAnimationEnd={(e) => { if (e.animationName === 'badgePulse') $widgetPulse.set(false) }}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="2" />
        </svg>
        <span className={styles.badgeLabel}>Objectifs</span>
        <span className={styles.badgeCount}>{completed}/{objectives.length}</span>
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="currentColor"
          className={`${styles.chevron} ${expanded ? styles.chevronUp : ''}`}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {expanded && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>Missions en cours</span>
          </div>
          <ul className={styles.list}>
            {objectives.map(obj => (
              <li
                key={obj.id}
                className={`${styles.item} ${obj.completed ? styles.completed : ''}`}
              >
                <div className={styles.checkbox}>
                  {obj.completed && (
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  )}
                </div>
                <div className={styles.labelCol}>
                  <span className={styles.label}>{obj.label}</span>
                  {obj.id === 'obj-morel-2' && !obj.completed && (
                    <button className={styles.screenshotBtn} onClick={startScreenshot}>
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                        <path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4z"/>
                        <path d="M9 2L7.17 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3.17L15 2H9zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                      </svg>
                      Capture d'écran
                    </button>
                  )}
                  {obj.id === 'obj-video-2' && !obj.completed && (
                    <button
                      className={styles.screenshotBtn}
                      onClick={() => openApp({
                        appId: 'hotel-map',
                        title: 'Localisation — Hôtels de Lannion',
                        icon: 'map',
                        defaultSize: { width: 900, height: 620 },
                      })}
                    >
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      Localiser
                    </button>
                  )}
                  {obj.id === 'obj-camera-1' && !obj.completed && (
                    <button
                      className={styles.screenshotBtn}
                      onClick={() => openApp({
                        appId: 'camera-viewer',
                        title: 'Caméras',
                        icon: 'camera',
                        defaultSize: { width: 900, height: 600 },
                      })}
                    >
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                        <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/>
                      </svg>
                      Ouvrir les caméras
                    </button>
                  )}
                  {obj.id === 'obj-plate-1' && !obj.completed && (
                    <button
                      className={styles.screenshotBtn}
                      onClick={() => setPlateModal(true)}
                    >
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v4H6zm4 0h8v1h-8zm0 3h8v1h-8z"/>
                      </svg>
                      Saisir la plaque
                    </button>
                  )}
                </div>
              </li>
            ))}
            {allDone && (
              <li className={`${styles.item} ${styles.newObjective}`}>
                <span className={styles.newObjectiveDot} />
                <span className={styles.label}>Consulter votre messagerie</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
    {showArrest && <ArrestOverlay />}
    </>
  )
}
