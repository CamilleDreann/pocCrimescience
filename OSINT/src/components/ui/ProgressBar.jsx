import styles from './ProgressBar.module.css'

export default function ProgressBar({ value = 0, indeterminate = false, color, height = 4 }) {
  return (
    <div className={styles.track} style={{ height }}>
      <div
        className={`${styles.fill} ${indeterminate ? styles.indeterminate : ''}`}
        style={{
          width: indeterminate ? '25%' : `${Math.min(100, Math.max(0, value))}%`,
          background: color || 'var(--color-accent)',
        }}
      />
    </div>
  )
}
