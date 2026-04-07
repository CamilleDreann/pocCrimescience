import { useEffect, useRef, useState } from 'react'
import { useStore } from '@nanostores/react'
import { $completionEvent, $widgetPulse } from '../../stores/objectivesStore'
import styles from './ObjectiveCompletionToast.module.css'

// Phases: null → 'pop' → 'float' → 'fly' → null
export default function ObjectiveCompletionToast() {
  const event = useStore($completionEvent)
  const [phase, setPhase] = useState(null)
  const [flyStyle, setFlyStyle] = useState({})
  const cardRef = useRef(null)

  // Start animation when a new event arrives
  useEffect(() => {
    if (!event) return
    let cancelled = false
    let t2, t3, raf1, raf2
    setPhase('pop')
    setFlyStyle({})

    const t1 = setTimeout(() => {
      if (cancelled) return
      setPhase('float')

      t2 = setTimeout(() => {
        if (cancelled) return
        setPhase('fly')
        raf1 = requestAnimationFrame(() => {
          if (cancelled) return
          const card = cardRef.current
          const badgeEl = document.querySelector('[data-objectives-badge]')
          if (card && badgeEl) {
            const cardRect = card.getBoundingClientRect()
            const badgeRect = badgeEl.getBoundingClientRect()
            const dx = (badgeRect.left + badgeRect.width / 2) - (cardRect.left + cardRect.width / 2)
            const dy = (badgeRect.top + badgeRect.height / 2) - (cardRect.top + cardRect.height / 2)
            raf2 = requestAnimationFrame(() => {
              if (cancelled) return
              setFlyStyle({
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 1, 1), opacity 0.4s ease-in',
                transform: `translate(${dx}px, ${dy}px) scale(0.15)`,
                opacity: 0,
              })
              t3 = setTimeout(() => {
                if (cancelled) return
                $widgetPulse.set(true)
                $completionEvent.set(null)
                setPhase(null)
                setFlyStyle({})
              }, 400)
            })
          }
        })
      }, 1300)
    }, 500)

    return () => {
      cancelled = true
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [event])

  if (!phase || !event) return null

  return (
    <div className={styles.overlay}>
      <div
        ref={cardRef}
        className={[
          styles.card,
          phase === 'pop' ? styles.animPop : '',
          phase === 'float' ? styles.animFloat : '',
        ].join(' ')}
        style={phase === 'fly' ? flyStyle : {}}
      >
        <svg className={styles.checkCircle} viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" />
          <path d="M11 18l5 5 9-9" />
        </svg>
        <span className={styles.header}>Objectif accompli</span>
        <span className={styles.label}>{event.label}</span>
      </div>
    </div>
  )
}
