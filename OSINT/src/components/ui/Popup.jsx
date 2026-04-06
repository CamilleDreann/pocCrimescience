import Icon from './Icon'
import styles from './Popup.module.css'

const TYPE_ICONS = {
  error: 'close',
  warning: 'info',
  success: 'check',
  info: 'info',
}

export default function Popup({ title, message, type = 'info', onClose, actions }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={e => e.stopPropagation()}>
        <div className={styles.iconRow}>
          <div className={`${styles.iconCircle} ${styles[type]}`}>
            <Icon name={TYPE_ICONS[type] || 'info'} size={18} />
          </div>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          {actions ? actions.map((action, i) => (
            <button
              key={i}
              className={`${styles.btn} ${action.primary ? styles.btnPrimary : styles.btnSecondary}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          )) : (
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onClose}>
              Compris
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
