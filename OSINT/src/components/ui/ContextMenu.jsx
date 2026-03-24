import { useRef, useEffect } from 'react'
import { useClickOutside } from '../../hooks/useClickOutside'
import Icon from './Icon'
import styles from './ContextMenu.module.css'

export default function ContextMenu({ items, x, y, onClose }) {
  const ref = useRef(null)
  useClickOutside(ref, onClose)

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  // Clamp to viewport
  const adjustedX = Math.min(x, window.innerWidth - 200)
  const adjustedY = Math.min(y, window.innerHeight - items.length * 36)

  return (
    <div
      ref={ref}
      className={styles.menu}
      style={{ left: adjustedX, top: adjustedY }}
    >
      {items.map((item, i) => {
        if (item.divider) {
          return <div key={i} className={styles.divider} />
        }
        return (
          <button
            key={i}
            className={`${styles.item} ${item.disabled ? styles.disabled : ''}`}
            onClick={() => {
              if (!item.disabled) {
                item.onClick?.()
                onClose()
              }
            }}
          >
            {item.icon && <Icon name={item.icon} size={14} />}
            <span>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
