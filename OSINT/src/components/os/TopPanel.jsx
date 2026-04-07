import { useOS } from '../../context/useOS'
import Clock from './Clock'
import SystemTray from './SystemTray'
import Icon from '../ui/Icon'
import styles from './TopPanel.module.css'

export default function TopPanel() {
  const { startScreenshot } = useOS()

  return (
    <div className={styles.panel}>
      <div className={styles.center}>
        <Clock />
      </div>
      <button
        className={styles.screenshotBtn}
        onClick={startScreenshot}
        title="Capture d'écran"
      >
        <Icon name="camera" size={14} />
      </button>
      <SystemTray />
    </div>
  )
}
