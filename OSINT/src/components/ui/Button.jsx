import Icon from './Icon'
import styles from './Button.module.css'

export default function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  disabled = false,
  onClick,
  children,
  className = '',
  ...props
}) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      {children && <span>{children}</span>}
    </button>
  )
}
