import { useEffect, useState } from 'react'
import { triggerResetToMenu } from '../../stores/objectivesStore'
import styles from './ArrestOverlay.module.css'

// Timeline:
// t=0ms     overlay blanc fade in (600ms)
// t=600ms   popup pop in
// t=4000ms  auto-close (ou bouton Fermer)
// t=4000ms  popup pop out (300ms)
// t=4300ms  overlay fade to black (700ms)
// t=5000ms  triggerResetToMenu → App reset + retour mission_select

export default function ArrestOverlay() {
  const [phase, setPhase] = useState('fadeIn') // fadeIn | visible | closing | black

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('visible'), 600)
    const t2 = setTimeout(() => startClosing(), 7000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  function startClosing() {
    setPhase('closing')
    setTimeout(() => setPhase('black'), 300)
    setTimeout(() => triggerResetToMenu(), 1000)
  }

  return (
    <div className={`${styles.overlay} ${phase === 'black' ? styles.overlayBlack : phase === 'closing' ? styles.overlayOut : ''}`}>
      {(phase === 'visible' || phase === 'closing') && (
        <div className={`${styles.card} ${phase === 'closing' ? styles.cardOut : ''}`}>
          <div className={styles.icon}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8H52V28C52 40 42 50 32 52C22 50 12 40 12 28V8Z" stroke="#d85e33" strokeWidth="3" fill="rgba(216,94,51,0.12)"/>
              <path d="M20 16H44V28C44 36 38 43 32 45C26 43 20 36 20 28V16Z" stroke="#d85e33" strokeWidth="2" fill="rgba(216,94,51,0.08)"/>
              <line x1="4" y1="8" x2="12" y2="8" stroke="#d85e33" strokeWidth="3"/>
              <line x1="4" y1="8" x2="4" y2="20" stroke="#d85e33" strokeWidth="3"/>
              <line x1="52" y1="8" x2="60" y2="8" stroke="#d85e33" strokeWidth="3"/>
              <line x1="60" y1="8" x2="60" y2="20" stroke="#d85e33" strokeWidth="3"/>
              <line x1="24" y1="56" x2="40" y2="56" stroke="#d85e33" strokeWidth="3"/>
              <line x1="32" y1="52" x2="32" y2="56" stroke="#d85e33" strokeWidth="2"/>
              <path d="M26 30L30 34L38 24" stroke="#d85e33" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.title}>MISSION ACCOMPLIE</div>
          <div className={styles.subtitle}>FUGITIF NEUTRALISÉ</div>
          <div className={styles.clues}>
            <div className={styles.cluesHeader}>INDICES DÉTERMINANTS</div>
            <div className={styles.clueItem}>
              <span className={styles.clueEmoji}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3C12 3 9 6 9 9C9 10.7 10.3 12 12 12C13.7 12 15 10.7 15 9C15 6 12 3 12 3Z" stroke="#d85e33" strokeWidth="1.8" strokeLinejoin="round"/>
                  <path d="M8 12C6 13 4 15 4 18H20C20 15 18 13 16 12" stroke="#d85e33" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="12" y1="12" x2="12" y2="21" stroke="#d85e33" strokeWidth="1.8" strokeDasharray="2 2"/>
                  <circle cx="7" cy="16" r="1.5" fill="#d85e33"/>
                  <circle cx="17" cy="16" r="1.5" fill="#d85e33"/>
                  <circle cx="12" cy="18" r="1.5" fill="#d85e33"/>
                </svg>
              </span>
              <span><strong>ADN</strong> — Correspondance punaises de lit confirmée</span>
            </div>
            <div className={styles.clueItem}>
              <span className={styles.clueEmoji}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="8" width="20" height="10" rx="1" stroke="#d85e33" strokeWidth="1.8"/>
                  <rect x="5" y="11" width="14" height="4" rx="0.5" stroke="#d85e33" strokeWidth="1.5" fill="rgba(216,94,51,0.1)"/>
                  <rect x="5" y="5" width="4" height="3" stroke="#d85e33" strokeWidth="1.5"/>
                  <rect x="15" y="5" width="4" height="3" stroke="#d85e33" strokeWidth="1.5"/>
                  <line x1="7" y1="12.5" x2="9" y2="12.5" stroke="#d85e33" strokeWidth="1.2" strokeLinecap="round"/>
                  <line x1="11" y1="12.5" x2="13" y2="12.5" stroke="#d85e33" strokeWidth="1.2" strokeLinecap="round"/>
                  <line x1="15" y1="12.5" x2="17" y2="12.5" stroke="#d85e33" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </span>
              <span><strong>Plaque d'immatriculation</strong> — Véhicule localisé</span>
            </div>
          </div>
          <div className={styles.message}>
            Grâce à votre recoupement d'indices, l'enquêteur a pu localiser et interpeller le fugitif.
            Excellent travail, agent.
          </div>
          <div className={styles.badge}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" stroke="#fff" strokeWidth="1.5" fill="#fff" opacity="0.3"/>
              <polygon points="12,4 14.5,10 21,10 16,14.5 18,21 12,17.5 6,21 8,14.5 3,10 9.5,10" stroke="#fff" strokeWidth="1.2"/>
            </svg>
            FÉLICITATIONS
          </div>
          <button className={styles.closeBtn} onClick={startClosing}>
            Fermer
          </button>
        </div>
      )}
    </div>
  )
}
