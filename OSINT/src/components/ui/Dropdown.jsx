import { useState, useRef } from 'react'
import { useClickOutside } from '../../hooks/useClickOutside'
import Icon from './Icon'
import styles from './Dropdown.module.css'

export default function Dropdown({ options = [], value, onChange, placeholder = 'Select...', disabled = false }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useClickOutside(ref, () => setOpen(false))

  const selected = options.find(o => o.value === value)

  return (
    <div className={`${styles.dropdown} ${disabled ? styles.disabled : ''}`} ref={ref}>
      <button className={styles.trigger} onClick={() => !disabled && setOpen(!open)}>
        <span className={selected ? '' : styles.placeholder}>
          {selected ? selected.label : placeholder}
        </span>
        <Icon name="chevron-down" size={14} className={`${styles.arrow} ${open ? styles.open : ''}`} />
      </button>
      {open && (
        <div className={styles.menu}>
          {options.map(option => (
            <button
              key={option.value}
              className={`${styles.option} ${option.value === value ? styles.selected : ''}`}
              onClick={() => { onChange(option.value); setOpen(false) }}
            >
              {option.label}
              {option.value === value && <Icon name="check" size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
