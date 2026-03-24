import { useState, useCallback } from 'react'

export function useContextMenu() {
  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, items: [] })

  const showMenu = useCallback((e, items) => {
    e.preventDefault()
    e.stopPropagation()
    setMenu({ visible: true, x: e.clientX, y: e.clientY, items })
  }, [])

  const hideMenu = useCallback(() => {
    setMenu(prev => ({ ...prev, visible: false }))
  }, [])

  return { menu, showMenu, hideMenu }
}
