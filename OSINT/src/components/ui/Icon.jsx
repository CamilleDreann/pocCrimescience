import styles from './Icon.module.css'

export default function Icon({ name, size = 24, className = '', color, style, ...props }) {
  return (
    <svg
      className={`${styles.icon} ${className}`}
      width={size}
      height={size}
      style={{ color: color, ...style }}
      aria-hidden="true"
      {...props}
    >
      <use href={`/icons.svg#${name}`} />
    </svg>
  )
}
