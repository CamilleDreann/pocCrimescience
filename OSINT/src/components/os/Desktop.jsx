import { Suspense } from 'react'
import { useStore } from '@nanostores/react'
import { useOS } from '../../context/useOS'
import { appRegistry } from '../../data/appRegistry'
import { $messages } from '../../stores/messagesStore'
import TopPanel from './TopPanel'
import Window from './Window'
import DesktopIcon from './DesktopIcon'
import AppLauncher from './AppLauncher'
import NotificationCenter from './NotificationCenter'
import ObjectivesWidget from './ObjectivesWidget'
import ObjectiveCompletionToast from './ObjectiveCompletionToast'
import ScreenshotOverlay from './ScreenshotOverlay'
import styles from './Desktop.module.css'

const desktopIcons = [
  { appId: 'file-manager', name: 'Fichiers', icon: 'folder' },
  { appId: 'terminal', name: 'Terminal', icon: 'terminal' },
  { appId: 'text-editor', name: 'Éditeur de texte', icon: 'text-file' },
  { appId: 'osint-search', name: 'OSINT Search', icon: 'osint-search' },
  { appId: 'link-graph', name: 'Link Graph', icon: 'link-graph' },
  { appId: 'messaging', name: 'Messagerie', icon: 'mail' },
  { appId: 'settings', name: 'Paramètres', icon: 'settings' },
]

export default function Desktop() {
  const { windows, openApp, system } = useOS()
  const messages = useStore($messages)
  const unreadMail = messages.filter(m => !m.readed).length

  const handleOpenApp = (appId) => {
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

  return (
    <div
      className={styles.desktop}
      style={{
        filter: `brightness(${system.brightness / 100})`,
      }}
    >
      <TopPanel />

      <div className={styles.iconGrid}>
        {desktopIcons.map(item => (
          <DesktopIcon
            key={item.appId}
            name={item.name}
            icon={item.icon}
            badge={item.appId === 'messaging' ? unreadMail : 0}
            onClick={() => handleOpenApp(item.appId)}
          />
        ))}
      </div>

      {windows.filter(w => w.isOpen).map(win => {
        const app = appRegistry.find(a => a.id === win.appId)
        const AppComponent = app?.component
        return (
          <Window key={win.id} windowData={win}>
            {AppComponent ? (
              <Suspense
                fallback={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', background: 'var(--color-bg-surface, #ffffff)', color: 'var(--color-text-primary, #000)' }}>
                    Chargement...
                  </div>
                }
              >
                <AppComponent windowId={win.id} {...(win.props || {})} />
              </Suspense>
            ) : (
              <div style={{ padding: 20, color: '#999' }}>App: {win.appId}</div>
            )}
          </Window>
        )
      })}

      <AppLauncher />
      <ScreenshotOverlay />
      <ObjectivesWidget />
      <ObjectiveCompletionToast />
      <NotificationCenter />
    </div>
  )
}
