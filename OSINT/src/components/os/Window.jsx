import { useCallback, useState } from 'react'
import { useOS } from '../../context/useOS'
import { useDrag, getSnapBounds } from '../../hooks/useDrag'
import { useResize } from '../../hooks/useResize'
import WindowTitleBar from './WindowTitleBar'
import SnapPreview from './SnapPreview'
import styles from './Window.module.css'

const RESIZE_DIRECTIONS = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

export default function Window({ windowData, children }) {
  const {
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    snapWindow,
    unsnapWindow,
  } = useOS()

  const { id, title, icon, isMinimized, isMaximized, zIndex, position, size, preSnapState } = windowData
  const [snapZone, setSnapZone] = useState(null)

  const { position: dragPos, setPosition, isDragging, handleMouseDown: startDrag } = useDrag(position, {
    onDragEnd: (pos, zone) => {
      setSnapZone(null)
      if (zone) {
        const bounds = getSnapBounds(zone)
        if (bounds) {
          snapWindow(id, bounds.position, bounds.size, { position: pos, size })
        }
      } else if (preSnapState) {
        unsnapWindow(id)
      } else {
        updateWindowPosition(id, pos)
      }
    },
    onSnapZoneChange: setSnapZone,
  })

  const { size: resizeSize, handleResizeStart, isResizing } = useResize(size, {
    onResizeEnd: (newSize, finalPos) => updateWindowSize(id, newSize, finalPos),
  })

  const handleFocus = useCallback(() => {
    focusWindow(id)
  }, [id, focusWindow])

  const handleDragStart = useCallback((e) => {
    if (isMaximized) return
    handleFocus()
    startDrag(e)
  }, [isMaximized, handleFocus, startDrag])

  const handleResizeMouseDown = useCallback((direction, e) => {
    if (isMaximized) return
    handleFocus()
    handleResizeStart(direction, e, dragPos, setPosition)
  }, [isMaximized, handleFocus, handleResizeStart, dragPos, setPosition])

  const actualPos = isMaximized ? { x: 0, y: 28 } : dragPos
  const actualSize = isMaximized
    ? { width: window.innerWidth, height: window.innerHeight - 28 }
    : resizeSize

  if (isMinimized) return null

  return (
    <>
      <div
        className={`${styles.window} ${isMaximized ? styles.maximized : ''} ${isDragging || isResizing ? styles.dragging : ''}`}
        style={{
          left: actualPos.x,
          top: actualPos.y,
          width: actualSize.width,
          height: actualSize.height,
          zIndex,
          animation: 'windowOpen 0.2s ease-out',
        }}
        onMouseDown={handleFocus}
      >
        <WindowTitleBar
          title={title}
          icon={icon}
          isMaximized={isMaximized}
          onClose={() => closeWindow(id)}
          onMinimize={() => minimizeWindow(id)}
          onMaximize={() => toggleMaximize(id)}
          onMouseDown={handleDragStart}
        />
        <div className={styles.content}>
          {children}
        </div>
        {!isMaximized && RESIZE_DIRECTIONS.map(dir => (
          <div
            key={dir}
            className={`${styles.resizeHandle} ${styles[`resize_${dir}`]}`}
            onMouseDown={(e) => handleResizeMouseDown(dir, e)}
          />
        ))}
      </div>
      {isDragging && <SnapPreview snapZone={snapZone} />}
    </>
  )
}
