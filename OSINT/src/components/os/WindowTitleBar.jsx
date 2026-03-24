import styles from './WindowTitleBar.module.css'
import Icon from '../ui/Icon'

export default function WindowTitleBar({ title, icon, isMaximized, onClose, onMinimize, onMaximize, onMouseDown }) {
  return (
    <div className={styles.titleBar} onMouseDown={onMouseDown} onDoubleClick={onMaximize}>
      <div className={styles.controls}>
        <button
          className={`${styles.btn} ${styles.close}`}
          onClick={(e) => { e.stopPropagation(); onClose() }}
          title="Close"
        >
          <Icon name="close" size={8} />
        </button>
        <button
          className={`${styles.btn} ${styles.minimize}`}
          onClick={(e) => { e.stopPropagation(); onMinimize() }}
          title="Minimize"
        >
          <Icon name="minimize" size={8} />
        </button>
        <button
          className={`${styles.btn} ${styles.maximize}`}
          onClick={(e) => { e.stopPropagation(); onMaximize() }}
          title={isMaximized ? 'Restore' : 'Maximize'}
        >
          <Icon name={isMaximized ? 'restore' : 'maximize'} size={8} />
        </button>
      </div>
      <div className={styles.titleCenter}>
        {icon && <Icon name={icon} size={14} className={styles.titleIcon} />}
        <span className={styles.titleText}>{title}</span>
      </div>
      <div className={styles.spacer} />
    </div>
  )
}
