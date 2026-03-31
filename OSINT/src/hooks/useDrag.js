import { useState, useCallback, useRef, useEffect } from 'react'

const EDGE_THRESHOLD = 16
const PANEL_HEIGHT = 28

function getSnapZone(clientX, clientY) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const midY = (vh - PANEL_HEIGHT) / 2 + PANEL_HEIGHT

  const onLeft = clientX < EDGE_THRESHOLD
  const onRight = clientX > vw - EDGE_THRESHOLD
  const onTop = clientY < PANEL_HEIGHT + EDGE_THRESHOLD

  if (onLeft) {
    if (clientY < midY) return 'top-left'
    if (clientY > vh - EDGE_THRESHOLD) return 'bottom-left'
    return 'left'
  }
  if (onRight) {
    if (clientY < midY) return 'top-right'
    if (clientY > vh - EDGE_THRESHOLD) return 'bottom-right'
    return 'right'
  }
  if (onTop) return 'maximize'
  return null
}

export function getSnapBounds(zone) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const usableH = vh - PANEL_HEIGHT
  const halfW = Math.round(vw / 2)
  const halfH = Math.round(usableH / 2)

  switch (zone) {
    case 'left':         return { position: { x: 0, y: PANEL_HEIGHT }, size: { width: halfW, height: usableH } }
    case 'right':        return { position: { x: halfW, y: PANEL_HEIGHT }, size: { width: halfW, height: usableH } }
    case 'top-left':     return { position: { x: 0, y: PANEL_HEIGHT }, size: { width: halfW, height: halfH } }
    case 'top-right':    return { position: { x: halfW, y: PANEL_HEIGHT }, size: { width: halfW, height: halfH } }
    case 'bottom-left':  return { position: { x: 0, y: PANEL_HEIGHT + halfH }, size: { width: halfW, height: halfH } }
    case 'bottom-right': return { position: { x: halfW, y: PANEL_HEIGHT + halfH }, size: { width: halfW, height: halfH } }
    case 'maximize':     return { position: { x: 0, y: PANEL_HEIGHT }, size: { width: vw, height: usableH } }
    default:             return null
  }
}

export function useDrag(initialPosition, { onDragEnd, onSnapZoneChange } = {}) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0, snapZone: null })

  // Sync with external position changes
  useEffect(() => {
    if (!isDragging) {
      setPosition(initialPosition)
    }
  }, [initialPosition.x, initialPosition.y])

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    e.preventDefault()
    setIsDragging(true)
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y,
      snapZone: null,
    }
  }, [position])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e) => {
      const dx = e.clientX - dragRef.current.startX
      const dy = e.clientY - dragRef.current.startY
      const newX = Math.max(0, Math.min(window.innerWidth - 100, dragRef.current.startPosX + dx))
      const newY = Math.max(0, Math.min(window.innerHeight - 50, dragRef.current.startPosY + dy))
      setPosition({ x: newX, y: newY })

      const zone = getSnapZone(e.clientX, e.clientY)
      if (zone !== dragRef.current.snapZone) {
        dragRef.current.snapZone = zone
        if (onSnapZoneChange) onSnapZoneChange(zone)
      }
    }

    const handleMouseUp = () => {
      const snapZone = dragRef.current.snapZone
      dragRef.current.snapZone = null
      if (onSnapZoneChange) onSnapZoneChange(null)
      setIsDragging(false)
      if (onDragEnd) onDragEnd(position, snapZone)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, onDragEnd, onSnapZoneChange, position])

  return { position, setPosition, isDragging, handleMouseDown }
}
