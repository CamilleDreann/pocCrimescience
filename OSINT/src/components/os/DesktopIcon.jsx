import { useCallback } from 'react'
import Icon from '../ui/Icon'
import styles from './DesktopIcon.module.css'

export default function DesktopIcon({ name, icon, onClick, badge }) {
  const handleClick = useCallback(() => {
    if (onClick) onClick()
  }, [onClick])

  return (
    <div className={styles.desktopIcon} onClick={handleClick}>
      <div className={`${styles.iconWrap} ${badge ? styles.pulse : ''}`}>
        <Icon name={icon} size={40} />
        {badge > 0 && <span className={styles.badge}>{badge}</span>}
      </div>
      <span className={styles.label}>{name}</span>
    </div>
  )
}
