import { useState } from 'react'
import { useStore } from '@nanostores/react'
import { $objectives, $widgetPulse } from '../../stores/objectivesStore'
import { useOS } from '../../context/useOS'
import styles from './ObjectivesWidget.module.css'

export default function ObjectivesWidget() {
  const objectives = useStore($objectives)
  const pulse = useStore($widgetPulse)
  const [expanded, setExpanded] = useState(false)
  const { startScreenshot } = useOS()

  if (objectives.length === 0) return null

  const completed = objectives.filter(o => o.completed).length
  const allDone = objectives.length > 0 && completed === objectives.length

  return (
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
  )
}
