// src/components/MissionSelect/MissionSelect.jsx
import styles from './MissionSelect.module.css'

const ShieldIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={styles.illustration}>
    <path d="M50 5 L90 20 L90 55 C90 75 70 90 50 95 C30 90 10 75 10 55 L10 20 Z" fill="white" />
  </svg>
)

const EyeIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={styles.illustration}>
    <ellipse cx="50" cy="50" rx="45" ry="28" fill="none" stroke="white" strokeWidth="5" />
    <circle cx="50" cy="50" r="14" fill="white" />
    <circle cx="50" cy="50" r="6" fill="#0a0a0a" />
  </svg>
)

export default function MissionSelect({ onMissionSelect }) {
  return (
    <div className={styles.container}>
      <div className={styles.side} onClick={() => onMissionSelect('beginner')}>
        <div className={styles.illustrationWrap}>
          <ShieldIcon />
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>MISSION DÉBUTANT</h1>
          <p className={styles.subtitle}>Prends tes premiers pas dans l'investigation numérique</p>
          <button className={styles.btn}>CHOISIR CETTE MISSION</button>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={`${styles.side} ${styles.sideRight}`} onClick={() => onMissionSelect('expert')}>
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
