import { useState, useCallback, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'
import { useOS } from '../../context/useOS'
import { addFile } from '../../apps/FileManager/fileSystemData'
import styles from './ScreenshotOverlay.module.css'

export default function ScreenshotOverlay() {
  const { screenshotMode, stopScreenshot, saveScreenshot, addNotification } = useOS()
  const [dragging, setDragging] = useState(false)
  const [start, setStart] = useState({ x: 0, y: 0 })
  const [end, setEnd] = useState({ x: 0, y: 0 })
  const overlayRef = useRef(null)

  useEffect(() => {
    if (!screenshotMode) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') stopScreenshot()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screenshotMode, stopScreenshot])

  const handleMouseDown = useCallback((e) => {
    setDragging(true)
    setStart({ x: e.clientX, y: e.clientY })
    setEnd({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return
    setEnd({ x: e.clientX, y: e.clientY })
  }, [dragging])

  const handleMouseUp = useCallback(async () => {
    if (!dragging) return
    setDragging(false)

    const x = Math.min(start.x, end.x)
    const y = Math.min(start.y, end.y)
    const w = Math.abs(end.x - start.x)
    const h = Math.abs(end.y - start.y)

    if (w < 10 || h < 10) {
      stopScreenshot()
      return
    }

    // Hide overlay before capturing
    if (overlayRef.current) overlayRef.current.style.display = 'none'

    try {
      const canvas = await html2canvas(document.body, {
        x,
        y,
        width: w,
        height: h,
        useCORS: true,
        scale: 1,
      })

      const dataUrl = canvas.toDataURL('image/png')
      const timestamp = Date.now()
      const fileName = `screenshot-${timestamp}.png`
      const filePath = `/home/Pictures/${fileName}`

      addFile(filePath, {
        type: 'file',
        name: fileName,
        size: `${Math.round(dataUrl.length / 1024)} KB`,
        modified: new Date().toISOString().split('T')[0],
        content: dataUrl,
      })

      saveScreenshot({ path: filePath, dataUrl, timestamp })

      addNotification({
        title: 'Screenshot',
        body: `Enregistr\u00e9 dans Pictures/${fileName}`,
        icon: 'camera',
      })
    } catch {
      addNotification({
        title: 'Screenshot',
        body: 'Erreur lors de la capture',
        icon: 'camera',
      })
    }

    stopScreenshot()
  }, [dragging, start, end, stopScreenshot, saveScreenshot, addNotification])

  if (!screenshotMode) return null

  const rect = dragging ? {
    left: Math.min(start.x, end.x),
    top: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  } : null

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className={styles.hint}>
        Cliquez et glissez pour s&eacute;lectionner une zone &bull; Echap pour annuler
      </div>
      {rect && rect.width > 0 && (
        <div className={styles.selection} style={rect} />
      )}
    </div>
  )
}
