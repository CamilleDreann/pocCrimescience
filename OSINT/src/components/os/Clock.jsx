import { useState, useEffect } from 'react'
import styles from './Clock.module.css'

export default function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const time = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const date = now.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  return (
    <div className={styles.clock}>
      <span className={styles.time}>{time}</span>
      <span className={styles.date}>{date}</span>
    </div>
  )
}
