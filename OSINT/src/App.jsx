import { Suspense } from 'react'
import Desktop from './components/os/Desktop'

export default function App() {
  return (
    <Suspense fallback={null}>
      <Desktop />
    </Suspense>
  )
}
