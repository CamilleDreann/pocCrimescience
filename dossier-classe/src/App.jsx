import { useState } from 'react'
import CameraViewer from './components/PhotoAnalyzer/CameraViewer'
import SuspectProfiles from './components/SuspectProfiles/SuspectProfiles'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('profiles') // 'profiles' ou 'camera'
  const [selectedVideo, setSelectedVideo] = useState('/preuve1.mp4')

  const handleSelectIndice = (indice) => {
    // Si l'indice est une video, ouvrir l'analyseur de caméra
    if (indice.type === 'video') {
      setSelectedVideo(indice.src)
      setCurrentView('camera')
    }
  }

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="app-nav">
        <button
          className={`nav-btn ${currentView === 'profiles' ? 'active' : ''}`}
          onClick={() => setCurrentView('profiles')}
        >
          <span className="nav-icon">◈</span>
          PROFILES
        </button>
        <button
          className={`nav-btn ${currentView === 'camera' ? 'active' : ''}`}
          onClick={() => setCurrentView('camera')}
        >
          <span className="nav-icon">▶</span>
          CAMÉRA
        </button>
      </nav>

      {/* Content */}
      <div className="app-content">
        {currentView === 'profiles' && (
          <SuspectProfiles onSelectIndice={handleSelectIndice} />
        )}
        {currentView === 'camera' && (
          <CameraViewer videoSrc={selectedVideo} />
        )}
      </div>
    </div>
  )
}

export default App
