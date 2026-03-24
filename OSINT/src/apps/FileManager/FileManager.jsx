import { useState } from 'react'
import { getChildren, getNode } from './fileSystemData'
import Icon from '../../components/ui/Icon'
import styles from './FileManager.module.css'

const sidebarItems = [
  { id: '/home', label: 'Home', icon: 'home' },
  { id: '/home/Documents', label: 'Documents', icon: 'folder' },
  { id: '/home/Downloads', label: 'Downloads', icon: 'download' },
  { id: '/home/Pictures', label: 'Pictures', icon: 'image' },
  { id: '/home/Desktop', label: 'Desktop', icon: 'folder' },
]

export default function FileManager() {
  const [currentPath, setCurrentPath] = useState('/home')
  const [viewMode, setViewMode] = useState('grid')

  const items = getChildren(currentPath)
  const pathParts = currentPath.split('/').filter(Boolean)

  const navigateTo = (path) => {
    const node = getNode(path)
    if (node && node.type === 'folder') {
      setCurrentPath(path)
    }
  }

  const goUp = () => {
    const parent = currentPath.split('/').slice(0, -1).join('/') || '/'
    setCurrentPath(parent)
  }

  return (
    <div className={styles.fileManager}>
      <div className={styles.sidebar}>
        {sidebarItems.map(item => (
          <button
            key={item.id}
            className={`${styles.sidebarItem} ${currentPath === item.id ? styles.active : ''}`}
            onClick={() => setCurrentPath(item.id)}
          >
            <Icon name={item.icon} size={16} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <div className={styles.main}>
        <div className={styles.toolbar}>
          <button className={styles.toolBtn} onClick={goUp}>
            <Icon name="arrow-left" size={16} />
          </button>
          <div className={styles.breadcrumb}>
            {pathParts.map((part, i) => (
              <span key={i}>
                <button
                  className={styles.breadcrumbBtn}
                  onClick={() => navigateTo('/' + pathParts.slice(0, i + 1).join('/'))}
                >
                  {part}
                </button>
                {i < pathParts.length - 1 && <Icon name="chevron-right" size={12} className={styles.breadcrumbSep} />}
              </span>
            ))}
          </div>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.toolBtn} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Icon name="grid-view" size={16} />
            </button>
            <button
              className={`${styles.toolBtn} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
            >
              <Icon name="list" size={16} />
            </button>
          </div>
        </div>
        <div className={`${styles.content} ${styles[viewMode]}`}>
          {items.length === 0 && (
            <div className={styles.empty}>Folder is empty</div>
          )}
          {items.map(item => (
            <div
              key={item.path}
              className={styles.fileItem}
              onDoubleClick={() => item.type === 'folder' && navigateTo(item.path)}
            >
              <Icon
                name={item.type === 'folder' ? 'folder' : 'file'}
                size={viewMode === 'grid' ? 40 : 18}
                color={item.type === 'folder' ? '#e95420' : undefined}
              />
              <span className={styles.fileName}>{item.name}</span>
              {viewMode === 'list' && (
                <>
                  <span className={styles.fileSize}>{item.size || '--'}</span>
                  <span className={styles.fileDate}>{item.modified || '--'}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
