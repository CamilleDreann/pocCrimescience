import Icon from './Icon'
import styles from './Slider.module.css'

export default function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  icon,
  showValue = false,
  disabled = false,
}) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.row}>
        {icon && <Icon name={icon} size={16} className={styles.icon} />}
        <input
          type="range"
          className={styles.slider}
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {showValue && <span className={styles.value}>{value}</span>}
      </div>
    </div>
  )
}
