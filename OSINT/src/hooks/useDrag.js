import { useState, useCallback, useRef, useEffect } from 'react'

export function useDrag(initialPosition, { onDragEnd } = {}) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 })

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
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      if (onDragEnd) onDragEnd(position)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, onDragEnd, position])

  return { position, setPosition, isDragging, handleMouseDown }
}
