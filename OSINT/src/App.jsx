import { Suspense, useState, useEffect } from 'react'
import { useStore } from '@nanostores/react'
import Desktop from './components/os/Desktop'
import MissionSelect from './components/MissionSelect/MissionSelect'
import { OSProvider } from './context/OSContext'
import { $resetToMenu, clearObjectives } from './stores/objectivesStore'
import { clearGraph } from './stores/graphStore'
import { resetMessages } from './stores/messagesStore'
import { clearScreenshots } from './apps/FileManager/fileSystemData'

export default function App() {
  const [screen, setScreen] = useState('mission_select')
  const [osKey, setOsKey] = useState(0)
  const resetToMenu = useStore($resetToMenu)

  useEffect(() => {
    if (!resetToMenu) return
    clearObjectives()
    clearGraph()
    resetMessages()
    clearScreenshots()
    $resetToMenu.set(false)
    setTimeout(() => {
      setOsKey(k => k + 1)
      setScreen('mission_select')
    }, 0)
  }, [resetToMenu])

  if (screen === 'mission_select') {
    return <MissionSelect onMissionSelect={() => setScreen('os')} />
  }

  return (
    <OSProvider key={osKey}>
      <Suspense fallback={null}>
        <Desktop />
      </Suspense>
    </OSProvider>
  )
}
