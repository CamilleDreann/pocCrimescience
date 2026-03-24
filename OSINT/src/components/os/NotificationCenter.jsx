import { useOS } from '../../context/useOS'
import Notification from './Notification'
import styles from './NotificationCenter.module.css'

export default function NotificationCenter() {
  const { notifications, dismissNotification } = useOS()

  if (notifications.length === 0) return null

  return (
    <div className={styles.center}>
      {notifications.slice(0, 5).map(notif => (
        <Notification
          key={notif.id}
          notification={notif}
          onDismiss={dismissNotification}
        />
      ))}
    </div>
  )
}
