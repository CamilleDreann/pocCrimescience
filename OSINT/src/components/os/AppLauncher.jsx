import { useState, useEffect, useCallback } from 'react'
import { useOS } from '../../context/useOS'
import { appRegistry } from '../../data/appRegistry'
import Icon from '../ui/Icon'
import styles from './AppLauncher.module.css'

export default function AppLauncher() {
  const { launcherOpen, closeLauncher, openApp } = useOS()
  const [search, setSearch] = useState('')

  const filtered = appRegistry.filter(app =>
    app.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleLaunch = useCallback((app) => {
    openApp({
      appId: app.id,
      title: app.title,
      icon: app.icon,
      defaultSize: app.defaultSize,
    })
    closeLauncher()
    setSearch('')
  }, [openApp, closeLauncher])

  useEffect(() => {
    if (!launcherOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        closeLauncher()
        setSearch('')
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [launcherOpen, closeLauncher])

  if (!launcherOpen) return null

  return (
    <div className={styles.overlay} onClick={() => { closeLauncher(); setSearch('') }}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.searchWrap}>
          <Icon name="search" size={18} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        <div className={styles.grid}>
          {filtered.map(app => (
            <button
              key={app.id}
              className={styles.appItem}
              onClick={() => handleLaunch(app)}
            >
              <div className={styles.appIcon}>
                <Icon name={app.icon} size={40} />
              </div>
              <span className={styles.appName}>{app.title}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className={styles.empty}>Aucune application trouvée</div>
          )}
        </div>
      </div>
    </div>
  )
}
