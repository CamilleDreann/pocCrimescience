import Icon from './Icon'
import styles from './Input.module.css'

export default function Input({
  value,
  onChange,
  placeholder,
  icon,
  variant = 'default',
  onSubmit,
  disabled = false,
  className = '',
  ...props
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(value)
    }
  }

  return (
    <div className={`${styles.wrapper} ${styles[variant]} ${className}`}>
      {icon && <Icon name={icon} size={16} className={styles.icon} />}
      <input
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </div>
  )
}
