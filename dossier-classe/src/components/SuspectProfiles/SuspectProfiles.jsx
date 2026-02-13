import { useState } from 'react'
import './SuspectProfiles.css'

// Donnees des suspects - a modifier selon tes besoins
const SUSPECTS = [
  {
    id: 1,
    nom: 'KOVAC',
    prenom: 'Viktor',
    alias: 'V-GHOST',
    statut: 'SUSPECT PRINCIPAL',
    dangerLevel: 'HIGH',
    photo: '/suspects/suspect1.png',
    indices: [
      { type: 'photo', label: 'Photo scene crime', src: '/indices/photo1.jpg' },
      { type: 'audio', label: 'Appel intercepte', src: '/indices/audio1.mp3' },
      { type: 'document', label: 'Releve bancaire', src: '/indices/doc1.pdf' },
    ]
  },
  {
    id: 2,
    nom: 'CHEN',
    prenom: 'Mei-Lin',
    alias: 'GHOST WIRE',
    statut: 'PERSONNE INTERET',
    dangerLevel: 'MEDIUM',
    photo: '/suspects/suspect3.png',
    indices: [
      { type: 'photo', label: 'Surveillance cam', src: '/indices/photo2.jpg' },
      { type: 'audio', label: 'Message vocal', src: '/indices/audio2.mp3' },
    ]
  },
  {
    id: 3,
    nom: 'REYES',
    prenom: 'Marco',
    alias: 'NETRUNNER',
    statut: 'TEMOIN',
    dangerLevel: 'LOW',
    photo: '/suspects/suspect2.png',
    indices: [
      { type: 'photo', label: 'Photo identite', src: '/indices/photo3.jpg' },
      { type: 'audio', label: 'Enregistrement temoignage', src: '/indices/audio3.mp3' },
    ]
  },
]

const INDICE_ICONS = {
  photo: '📷',
  audio: '🎵',
  document: '📄',
  video: '🎬',
}

function SuspectProfiles({ onSelectIndice }) {
  const [selectedSuspect, setSelectedSuspect] = useState(null)
  const [hoveredSuspect, setHoveredSuspect] = useState(null)
  const [activeIndice, setActiveIndice] = useState(null)

  const getDangerColor = (level) => {
    switch (level) {
      case 'HIGH': return 'var(--sp-red)'
      case 'MEDIUM': return 'var(--sp-yellow)'
      case 'LOW': return 'var(--sp-green)'
      default: return 'var(--sp-cyan)'
    }
  }

  const handleIndiceClick = (indice) => {
    setActiveIndice(indice)
    if (onSelectIndice) {
      onSelectIndice(indice)
    }
  }

  return (
    <div className="suspect-profiles-container">
      {/* Header */}
      <div className="sp-header">
        <div className="sp-title">
          <span className="sp-icon">◈</span>
          NCPD DATABASE
        </div>
        <div className="sp-header-info">
          <span className="sp-status">● CONNECTED</span>
          <span className="sp-count">{SUSPECTS.length} RECORDS</span>
        </div>
      </div>

      <div className="sp-main">
        {/* Liste des suspects */}
        <div className="sp-list-panel">
          <div className="sp-panel-header">
            <span className="sp-label">SUSPECTS:</span>
            <span className="sp-value">{SUSPECTS.length}</span>
          </div>

          <div className="sp-list">
            {SUSPECTS.map((suspect) => (
              <div
                key={suspect.id}
                className={`sp-card ${selectedSuspect?.id === suspect.id ? 'active' : ''}`}
                onClick={() => setSelectedSuspect(suspect)}
                onMouseEnter={() => setHoveredSuspect(suspect)}
                onMouseLeave={() => setHoveredSuspect(null)}
                style={{ '--danger-color': getDangerColor(suspect.dangerLevel) }}
              >
                <div className="sp-card-photo">
                  <img src={suspect.photo} alt={suspect.nom} onError={(e) => {
                    e.target.style.display = 'none'
                  }} />
                  <div className="sp-photo-overlay">
                    <span className="sp-scan-effect" />
                  </div>
                  <div className="sp-danger-badge" style={{ background: getDangerColor(suspect.dangerLevel) }}>
                    {suspect.dangerLevel}
                  </div>
                </div>

                <div className="sp-card-info">
                  <div className="sp-name">{suspect.nom}</div>
                  <div className="sp-prenom">{suspect.prenom}</div>
                  <div className="sp-alias">"{suspect.alias}"</div>
                  <div className="sp-statut">{suspect.statut}</div>
                  <div className="sp-indices-count">
                    <span className="sp-indices-icon">◈</span>
                    {suspect.indices.length} INDICES
                  </div>
                </div>

                <div className="sp-card-corner" />
              </div>
            ))}
          </div>
        </div>

        {/* Detail du suspect */}
        <div className="sp-detail-panel">
          {selectedSuspect ? (
            <>
              <div className="sp-detail-header">
                <div className="sp-detail-photo">
                  <img src={selectedSuspect.photo} alt={selectedSuspect.nom} onError={(e) => {
                    e.target.style.display = 'none'
                  }} />
                  <div className="sp-detail-overlay">
                    <div className="sp-scan-lines" />
                    <div className="sp-scan-grid" />
                  </div>
                </div>

                <div className="sp-detail-identity">
                  <div className="sp-detail-statut" style={{ color: getDangerColor(selectedSuspect.dangerLevel) }}>
                    {selectedSuspect.statut}
                  </div>
                  <div className="sp-detail-nom">{selectedSuspect.nom}</div>
                  <div className="sp-detail-prenom">{selectedSuspect.prenom}</div>
                  <div className="sp-detail-alias">ALIAS: "{selectedSuspect.alias}"</div>

                  <div className="sp-detail-stats">
                    <div className="sp-stat">
                      <span className="sp-stat-label">DANGER LEVEL</span>
                      <div className="sp-stat-bar">
                        <div
                          className="sp-stat-fill"
                          style={{
                            width: selectedSuspect.dangerLevel === 'HIGH' ? '100%' :
                                   selectedSuspect.dangerLevel === 'MEDIUM' ? '60%' : '30%',
                            background: getDangerColor(selectedSuspect.dangerLevel)
                          }}
                        />
                      </div>
                    </div>
                    <div className="sp-stat">
                      <span className="sp-stat-label">INDICES COLLECTED</span>
                      <span className="sp-stat-value">{selectedSuspect.indices.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sp-indices-section">
                <div className="sp-section-header">
                  <span className="sp-section-icon">◈</span>
                  INDICES ASSOCIES
                </div>

                <div className="sp-indices-grid">
                  {selectedSuspect.indices.map((indice, idx) => (
                    <div
                      key={idx}
                      className={`sp-indice-card ${activeIndice === indice ? 'active' : ''}`}
                      onClick={() => handleIndiceClick(indice)}
                    >
                      <div className="sp-indice-icon">
                        {INDICE_ICONS[indice.type] || '◈'}
                      </div>
                      <div className="sp-indice-info">
                        <div className="sp-indice-type">{indice.type.toUpperCase()}</div>
                        <div className="sp-indice-label">{indice.label}</div>
                      </div>
                      <div className="sp-indice-action">▶</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview zone */}
              {activeIndice && (
                <div className="sp-preview-zone">
                  <div className="sp-preview-header">
                    <span>PREVIEW: {activeIndice.label}</span>
                    <button className="sp-preview-close" onClick={() => setActiveIndice(null)}>✕</button>
                  </div>
                  <div className="sp-preview-content">
                    {activeIndice.type === 'photo' && (
                      <img src={activeIndice.src} alt={activeIndice.label} className="sp-preview-image" />
                    )}
                    {activeIndice.type === 'audio' && (
                      <audio controls src={activeIndice.src} className="sp-preview-audio" />
                    )}
                    {activeIndice.type === 'video' && (
                      <video controls src={activeIndice.src} className="sp-preview-video" />
                    )}
                    {activeIndice.type === 'document' && (
                      <div className="sp-preview-doc">
                        <span className="sp-doc-icon">📄</span>
                        <a href={activeIndice.src} target="_blank" rel="noopener noreferrer" className="sp-doc-link">
                          OUVRIR LE DOCUMENT
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="sp-no-selection">
              <div className="sp-no-selection-icon">◈</div>
              <div className="sp-no-selection-text">SELECTIONNEZ UN SUSPECT</div>
              <div className="sp-no-selection-sub">Cliquez sur un profil pour voir les details</div>
            </div>
          )}
        </div>
      </div>

      {/* Watermark */}
      <div className="sp-watermark">NCPD</div>
    </div>
  )
}

export default SuspectProfiles
