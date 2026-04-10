// src/components/MissionSelect/MissionSelect.jsx
import styles from './MissionSelect.module.css'

const ShieldIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={styles.illustration}>
    <path d="M50 5 L90 20 L90 55 C90 75 70 90 50 95 C30 90 10 75 10 55 L10 20 Z" fill="currentColor" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const EyeIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={styles.illustration}>
    <ellipse cx="50" cy="50" rx="45" ry="28" fill="none" stroke="currentColor" strokeWidth="6" />
    <circle cx="50" cy="50" r="14" fill="currentColor" />
    <circle cx="50" cy="50" r="6" fill="var(--color-bg-desktop, #ffffff)" />
  </svg>
)

export default function MissionSelect({ onMissionSelect }) {
  return (
    <div className={styles.container}>
      <div
        className={styles.side}
        role="button"
        tabIndex={0}
        onClick={() => onMissionSelect('beginner')}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onMissionSelect('beginner') }}
      >
        <div className={styles.illustrationWrap}>
          <ShieldIcon />
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>MISSION DÉBUTANT</h1>
          <p className={styles.subtitle}>Fais tes premiers pas dans l'investigation numérique</p>
          <button className={styles.btn}>CHOISIR CETTE MISSION</button>
        </div>
      </div>

      <div className={styles.divider} />

      <div
        className={`${styles.side} ${styles.sideRight}`}
        role="button"
        tabIndex={0}
        onClick={() => onMissionSelect('expert')}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onMissionSelect('expert') }}
      >
        <div className={styles.illustrationWrap}>
          <EyeIcon />
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>MISSION EXPERT</h1>
          <p className={styles.subtitle}>Mène une enquête avancée sur des cibles complexes</p>
          <button className={styles.btn}>CHOISIR CETTE MISSION</button>
        </div>
      </div>
    </div>
  )
}
