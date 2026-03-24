import styles from './Toggle.module.css'

export default function Toggle({ checked, onChange, label, disabled = false }) {
  return (
    <label className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`}>
      {label && <span className={styles.label}>{label}</span>}
      <button
        role="switch"
        aria-checked={checked}
        className={`${styles.toggle} ${checked ? styles.active : ''}`}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
      >
        <div className={styles.thumb} />
      </button>
    </label>
  )
}
