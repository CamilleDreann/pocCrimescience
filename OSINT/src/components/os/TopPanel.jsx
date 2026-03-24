import { useOS } from '../../context/useOS'
import Clock from './Clock'
import SystemTray from './SystemTray'
import styles from './TopPanel.module.css'

export default function TopPanel() {
  const { toggleLauncher } = useOS()

  return (
    <div className={styles.panel}>
      <button className={styles.activities} onClick={toggleLauncher}>
        Activities
      </button>
      <div className={styles.center}>
        <Clock />
      </div>
      <SystemTray />
    </div>
  )
}
