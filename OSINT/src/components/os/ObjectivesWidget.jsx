import { useState } from 'react'
import { useStore } from '@nanostores/react'
import { $objectives, $widgetPulse, completeObjective } from '../../stores/objectivesStore'
import styles from './ObjectivesWidget.module.css'

export default function ObjectivesWidget() {
  const objectives = useStore($objectives)
  const pulse = useStore($widgetPulse)
  const [expanded, setExpanded] = useState(false)

  if (objectives.length === 0) return null

  const completed = objectives.filter(o => o.completed).length

  return (
    <div className={styles.wrapper}>
      <button
        data-objectives-badge
        className={`${styles.badge} ${pulse ? styles.badgePulse : ''}`}
        onClick={() => setExpanded(e => !e)}
        onAnimationEnd={() => $widgetPulse.set(false)}
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
                <button
                  className={styles.checkbox}
                  onClick={() => !obj.completed && completeObjective(obj.id)}
                  disabled={obj.completed}
                >
                  {obj.completed && (
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  )}
                </button>
                <span className={styles.label}>{obj.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
