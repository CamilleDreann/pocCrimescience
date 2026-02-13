import { useState } from 'react'
import BraindanceEditor from './components/PhotoAnalyzer/BraindanceEditor'
import SuspectProfiles from './components/SuspectProfiles/SuspectProfiles'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('profiles') // 'profiles' ou 'braindance'
  const [selectedVideo, setSelectedVideo] = useState('/preuve1.mp4')

  const handleSelectIndice = (indice) => {
    // Si l'indice est une video, ouvrir le lecteur Braindance
    if (indice.type === 'video') {
      setSelectedVideo(indice.src)
      setCurrentView('braindance')
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
          className={`nav-btn ${currentView === 'braindance' ? 'active' : ''}`}
          onClick={() => setCurrentView('braindance')}
        >
          <span className="nav-icon">▶</span>
          BRAINDANCE
        </button>
      </nav>

      {/* Content */}
      <div className="app-content">
        {currentView === 'profiles' && (
          <SuspectProfiles onSelectIndice={handleSelectIndice} />
        )}
        {currentView === 'braindance' && (
          <BraindanceEditor videoSrc={selectedVideo} />
        )}
      </div>
    </div>
  )
}

export default App
