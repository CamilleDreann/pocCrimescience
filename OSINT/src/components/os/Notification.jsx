import { useEffect } from 'react'
import Icon from '../ui/Icon'
import styles from './Notification.module.css'

export default function Notification({ notification, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id)
    }, 4000)
    return () => clearTimeout(timer)
  }, [notification.id, onDismiss])

  return (
    <div className={styles.notification}>
      <div className={styles.header}>
        <span className={styles.title}>{notification.title}</span>
        <button className={styles.closeBtn} onClick={() => onDismiss(notification.id)}>
          <Icon name="close" size={12} />
        </button>
      </div>
      {notification.body && (
        <p className={styles.body}>{notification.body}</p>
      )}
    </div>
  )
}
