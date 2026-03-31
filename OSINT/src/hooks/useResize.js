import { useState, useCallback, useRef, useEffect } from 'react'

const MIN_WIDTH = 400
const MIN_HEIGHT = 300

export function useResize(initialSize, { minSize, onResizeEnd } = {}) {
  const [size, setSize] = useState(initialSize)
  const [isResizing, setIsResizing] = useState(false)
  const resizeRef = useRef({
    direction: '',
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startPosX: 0,
    startPosY: 0,
    positionSetter: null,
    lastPosition: null,
  })

  // Sync with external size changes (e.g. snap)
  useEffect(() => {
    if (!isResizing) {
      setSize(initialSize)
    }
  }, [initialSize.width, initialSize.height])

  const minW = minSize?.width || MIN_WIDTH
  const minH = minSize?.height || MIN_HEIGHT

  const handleResizeStart = useCallback((direction, e, currentPosition, setPosition) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    resizeRef.current = {
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
      startPosX: currentPosition.x,
      startPosY: currentPosition.y,
      positionSetter: setPosition,
    }
  }, [size])

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e) => {
      const { direction, startX, startY, startWidth, startHeight, startPosX, startPosY, positionSetter } = resizeRef.current
      const dx = e.clientX - startX
      const dy = e.clientY - startY

      let newWidth = startWidth
      let newHeight = startHeight
      let newX = startPosX
      let newY = startPosY

      if (direction.includes('e')) newWidth = Math.max(minW, startWidth + dx)
      if (direction.includes('w')) {
        newWidth = Math.max(minW, startWidth - dx)
        newX = startPosX + (startWidth - newWidth)
      }
      if (direction.includes('s')) newHeight = Math.max(minH, startHeight + dy)
      if (direction.includes('n')) {
        newHeight = Math.max(minH, startHeight - dy)
        newY = startPosY + (startHeight - newHeight)
      }

      setSize({ width: newWidth, height: newHeight })
      resizeRef.current.lastPosition = { x: newX, y: newY }
      if (positionSetter && (direction.includes('n') || direction.includes('w'))) {
        positionSetter({ x: newX, y: newY })
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      if (onResizeEnd) onResizeEnd(size, resizeRef.current.lastPosition)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, minW, minH, onResizeEnd, size])

  return { size, setSize, isResizing, handleResizeStart }
}
