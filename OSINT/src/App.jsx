import { Suspense, useState } from 'react'
import Desktop from './components/os/Desktop'
import MissionSelect from './components/MissionSelect/MissionSelect'

export default function App() {
  const [screen, setScreen] = useState('mission_select')

  if (screen === 'mission_select') {
    return <MissionSelect onMissionSelect={() => setScreen('os')} />
  }

  return (
    <Suspense fallback={null}>
      <Desktop />
    </Suspense>
  )
}
