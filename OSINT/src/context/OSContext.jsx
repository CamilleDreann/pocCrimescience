import { createContext, useReducer, useCallback } from 'react'

const initialState = {
  windows: [],
  zIndexCounter: 10,
  activeWindowId: null,
  launcherOpen: false,
  notifications: [],
  graphData: [],
  system: {
    volume: 70,
    brightness: 80,
    wifi: true,
    bluetooth: false,
    wallpaper: null,
  },
}

function reducer(state, action) {
  switch (action.type) {
    case 'OPEN_APP': {
      const { appId, title, icon, defaultSize, props, multiInstance } = action.payload
      if (!multiInstance) {
        const existing = state.windows.find(w => w.appId === appId)
        if (existing) {
          // Focus existing window
          const newZ = state.zIndexCounter + 1
          return {
            ...state,
            zIndexCounter: newZ,
            activeWindowId: existing.id,
            windows: state.windows.map(w =>
              w.id === existing.id
                ? { ...w, isOpen: true, isMinimized: false, zIndex: newZ, ...(props ? { props } : {}) }
                : w
            ),
          }
        }
      }
      const id = `${appId}-${Date.now()}`
      const newZ = state.zIndexCounter + 1
      const offset = (state.windows.length % 8) * 30
      return {
        ...state,
        zIndexCounter: newZ,
        activeWindowId: id,
        windows: [
          ...state.windows,
          {
            id,
            appId,
            title,
            icon,
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            zIndex: newZ,
            position: { x: 80 + offset, y: 60 + offset },
            size: defaultSize || { width: 800, height: 550 },
            ...(props ? { props } : {}),
          },
        ],
      }
    }

    case 'CLOSE_WINDOW': {
      const windows = state.windows.filter(w => w.id !== action.payload)
      return {
        ...state,
        windows,
        activeWindowId: state.activeWindowId === action.payload
          ? (windows.length > 0 ? windows[windows.length - 1].id : null)
          : state.activeWindowId,
      }
    }

    case 'MINIMIZE_WINDOW': {
      return {
        ...state,
        activeWindowId: state.activeWindowId === action.payload ? null : state.activeWindowId,
        windows: state.windows.map(w =>
          w.id === action.payload ? { ...w, isMinimized: true } : w
        ),
      }
    }

    case 'TOGGLE_MAXIMIZE': {
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload ? { ...w, isMaximized: !w.isMaximized } : w
        ),
      }
    }

    case 'FOCUS_WINDOW': {
      const newZ = state.zIndexCounter + 1
      return {
        ...state,
        zIndexCounter: newZ,
        activeWindowId: action.payload,
        windows: state.windows.map(w =>
          w.id === action.payload
            ? { ...w, zIndex: newZ, isMinimized: false }
            : w
        ),
      }
    }

    case 'UPDATE_POSITION': {
      const { id, position } = action.payload
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === id ? { ...w, position } : w
        ),
      }
    }

    case 'UPDATE_SIZE': {
      const { id, size, position } = action.payload
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === id
            ? { ...w, size, ...(position ? { position } : {}) }
            : w
        ),
      }
    }

    case 'TOGGLE_LAUNCHER': {
      return { ...state, launcherOpen: !state.launcherOpen }
    }

    case 'CLOSE_LAUNCHER': {
      return { ...state, launcherOpen: false }
    }

    case 'ADD_NOTIFICATION': {
      const notification = {
        id: `notif-${Date.now()}`,
        timestamp: new Date(),
        read: false,
        ...action.payload,
      }
      return {
        ...state,
        notifications: [notification, ...state.notifications],
      }
    }

    case 'DISMISS_NOTIFICATION': {
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      }
    }

    case 'UPDATE_SYSTEM': {
      const { key, value } = action.payload
      return {
        ...state,
        system: { ...state.system, [key]: value },
      }
    }

    case 'EXPORT_TO_GRAPH': {
      const newEntry = action.payload
      const exists = state.graphData.some((d) => d.email === newEntry.email)
      if (exists) return state
      return { ...state, graphData: [...state.graphData, newEntry] }
    }

    case 'CLEAR_GRAPH': {
      return { ...state, graphData: [] }
    }

    default:
      return state
  }
}

export const OSContext = createContext(null)

export function OSProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const openApp = useCallback((app) => {
    dispatch({ type: 'OPEN_APP', payload: app })
  }, [])

  const closeWindow = useCallback((id) => {
    dispatch({ type: 'CLOSE_WINDOW', payload: id })
  }, [])

  const minimizeWindow = useCallback((id) => {
    dispatch({ type: 'MINIMIZE_WINDOW', payload: id })
  }, [])

  const toggleMaximize = useCallback((id) => {
    dispatch({ type: 'TOGGLE_MAXIMIZE', payload: id })
  }, [])

  const focusWindow = useCallback((id) => {
    dispatch({ type: 'FOCUS_WINDOW', payload: id })
  }, [])

  const updateWindowPosition = useCallback((id, position) => {
    dispatch({ type: 'UPDATE_POSITION', payload: { id, position } })
  }, [])

  const updateWindowSize = useCallback((id, size, position) => {
    dispatch({ type: 'UPDATE_SIZE', payload: { id, size, position } })
  }, [])

  const toggleLauncher = useCallback(() => {
    dispatch({ type: 'TOGGLE_LAUNCHER' })
  }, [])

  const closeLauncher = useCallback(() => {
    dispatch({ type: 'CLOSE_LAUNCHER' })
  }, [])

  const addNotification = useCallback((notif) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notif })
  }, [])

  const dismissNotification = useCallback((id) => {
    dispatch({ type: 'DISMISS_NOTIFICATION', payload: id })
  }, [])

  const updateSystem = useCallback((key, value) => {
    dispatch({ type: 'UPDATE_SYSTEM', payload: { key, value } })
  }, [])

  const exportToGraph = useCallback((data) => {
    dispatch({ type: 'EXPORT_TO_GRAPH', payload: data })
  }, [])

  const clearGraph = useCallback(() => {
    dispatch({ type: 'CLEAR_GRAPH' })
  }, [])

  const value = {
    ...state,
    openApp,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    toggleLauncher,
    closeLauncher,
    addNotification,
    dismissNotification,
    updateSystem,
    exportToGraph,
    clearGraph,
  }

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>
}
