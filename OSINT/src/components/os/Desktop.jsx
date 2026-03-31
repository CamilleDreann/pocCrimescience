import { useEffect, useRef, useState } from 'react'
import { useOS } from '../../context/useOS'
import { useContextMenu } from '../../hooks/useContextMenu'
import { appRegistry } from '../../data/appRegistry'
import TopPanel from './TopPanel'
import Window from './Window'
import DesktopIcon from './DesktopIcon'
import AppLauncher from './AppLauncher'
import NotificationCenter from './NotificationCenter'
import ContextMenu from '../ui/ContextMenu'
import ScreenshotOverlay from './ScreenshotOverlay'
import styles from './Desktop.module.css'

const desktopIcons = [
  { appId: 'file-manager', name: 'Files', icon: 'folder' },
  { appId: 'terminal', name: 'Terminal', icon: 'terminal' },
  { appId: 'text-editor', name: 'Text Editor', icon: 'text-file' },
  { appId: 'osint-search', name: 'OSINT Search', icon: 'osint-search' },
  { appId: 'link-graph', name: 'Link Graph', icon: 'link-graph' },
  { appId: 'messaging', name: 'Messagerie', icon: 'mail' },
  { appId: 'settings', name: 'Settings', icon: 'settings' },
]

export default function Desktop() {
  const { windows, openApp, addNotification, system, toggleLauncher } = useOS()
  const { menu, showMenu, hideMenu } = useContextMenu()
  const [unreadMail, setUnreadMail] = useState(1)
  const notifSent = useRef(false)

  useEffect(() => {
    if (notifSent.current) return
    notifSent.current = true
    const timer = setTimeout(() => {
      addNotification({
        title: 'Messagerie',
        body: 'Nouveau message de Marie Dupont',
        icon: 'mail',
      })
    }, 2000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpenApp = (appId) => {
    if (appId === 'messaging') setUnreadMail(0)
    const app = appRegistry.find(a => a.id === appId)
    if (app) {
      openApp({
        appId: app.id,
        title: app.title,
        icon: app.icon,
        defaultSize: app.defaultSize,
      })
    }
  }

  const desktopMenuItems = [
    { label: 'Open Terminal', icon: 'terminal', onClick: () => handleOpenApp('terminal') },
    { label: 'Open File Manager', icon: 'folder', onClick: () => handleOpenApp('file-manager') },
    { divider: true },
    { label: 'Settings', icon: 'settings', onClick: () => handleOpenApp('settings') },
    { label: 'Show Applications', icon: 'grid', onClick: () => toggleLauncher() },
  ]

  return (
    <div
      className={styles.desktop}
      style={{
        filter: `brightness(${system.brightness / 100})`,
      }}
      onContextMenu={(e) => showMenu(e, desktopMenuItems)}
    >
      <TopPanel />

      <div className={styles.iconGrid}>
        {desktopIcons.map(item => (
          <DesktopIcon
            key={item.appId}
            name={item.name}
            icon={item.icon}
            badge={item.appId === 'messaging' ? unreadMail : 0}
            onDoubleClick={() => handleOpenApp(item.appId)}
          />
        ))}
      </div>

      {windows.filter(w => w.isOpen).map(win => {
        const app = appRegistry.find(a => a.id === win.appId)
        const AppComponent = app?.component
        return (
          <Window key={win.id} windowData={win}>
            {AppComponent ? <AppComponent windowId={win.id} {...(win.props || {})} /> : (
              <div style={{ padding: 20, color: '#999' }}>App: {win.appId}</div>
            )}
          </Window>
        )
      })}

      <AppLauncher />
      <ScreenshotOverlay />
      <NotificationCenter />
      {menu.visible && (
        <ContextMenu items={menu.items} x={menu.x} y={menu.y} onClose={hideMenu} />
      )}
    </div>
  )
}
