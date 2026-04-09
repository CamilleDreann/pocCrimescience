import { useState, useRef, useCallback } from 'react'
import { useOS } from '../../context/useOS'
import { useClickOutside } from '../../hooks/useClickOutside'
import Icon from '../ui/Icon'
import styles from './SystemTray.module.css'

export default function SystemTray() {
  const { system, updateSystem } = useOS()
  const [popupOpen, setPopupOpen] = useState(false)
  const popupRef = useRef(null)

  useClickOutside(popupRef, () => setPopupOpen(false))

  const togglePopup = useCallback(() => {
    setPopupOpen(prev => !prev)
  }, [])

  const volumeIcon = system.volume === 0 ? 'volume-mute' : system.volume < 50 ? 'volume-low' : 'volume-high'

  return (
    <div className={styles.tray} ref={popupRef}>
      <button className={styles.trayBtn} onClick={togglePopup}>
        <Icon name={system.wifi ? 'wifi' : 'wifi-off'} size={14} />
      </button>
      <button className={styles.trayBtn} onClick={togglePopup}>
        <Icon name={volumeIcon} size={14} />
      </button>
      <button className={styles.trayBtn} onClick={togglePopup}>
        <Icon name="battery" size={14} />
      </button>
      <button className={styles.trayBtn} onClick={togglePopup}>
        <Icon name="power" size={14} />
      </button>

      {popupOpen && (
        <div className={styles.popup}>
          <div className={styles.popupRow}>
            <Icon name={system.wifi ? 'wifi' : 'wifi-off'} size={16} />
            <span>{system.wifi ? 'Wi-Fi' : 'Wi-Fi désactivé'}</span>
            <button
              className={`${styles.toggleBtn} ${system.wifi ? styles.active : ''}`}
              onClick={() => updateSystem('wifi', !system.wifi)}
            >
              <div className={styles.toggleThumb} />
            </button>
          </div>
          <div className={styles.popupRow}>
            <Icon name="bluetooth" size={16} />
            <span>Bluetooth</span>
            <button
              className={`${styles.toggleBtn} ${system.bluetooth ? styles.active : ''}`}
              onClick={() => updateSystem('bluetooth', !system.bluetooth)}
            >
              <div className={styles.toggleThumb} />
            </button>
          </div>
          <div className={styles.divider} />
          <div className={styles.sliderRow}>
            <Icon name={volumeIcon} size={16} />
            <input
              type="range"
              min="0"
              max="100"
              value={system.volume}
              onChange={(e) => updateSystem('volume', Number(e.target.value))}
              className={styles.slider}
            />
          </div>
          <div className={styles.sliderRow}>
            <Icon name="brightness" size={16} />
            <input
              type="range"
              min="10"
              max="100"
              value={system.brightness}
              onChange={(e) => updateSystem('brightness', Number(e.target.value))}
              className={styles.slider}
            />
          </div>
          <div className={styles.divider} />
          <button className={styles.popupAction}>
            <Icon name="settings" size={16} />
            <span>Paramètres</span>
          </button>
          <button className={styles.popupAction}>
            <Icon name="power" size={16} />
            <span>Éteindre</span>
          </button>
        </div>
      )}
    </div>
  )
}
