import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { completeObjective } from '../../stores/objectivesStore'
import { addMessage } from '../../stores/messagesStore'
import { useOS } from '../../context/useOS'
import styles from './HotelMap.module.css'

const HOTELS = [
  { id: 'ibis', name: 'Ibis Lannion', position: [48.7332, -3.4592], correct: true },
  { id: 'bretagne', name: 'Hôtel de Bretagne', position: [48.7310, -3.4550], correct: false },
  { id: 'ker-bugalic', name: 'Hôtel Ker Bugalic', position: [48.7290, -3.4620], correct: false },
]

function createPinIcon(selected) {
  const bg = '#d85E33'
  const shadow = selected ? '3px 3px 0 #000' : '2px 2px 0 #000'
  const dotColor = selected ? '#ffffff' : '#000000'
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <path d="M14 0C6.27 0 0 6.27 0 14c0 9.625 12.25 21.875 13.125 22.75a1.25 1.25 0 0 0 1.75 0C15.75 35.875 28 23.625 28 14 28 6.27 21.73 0 14 0z"
        fill="${bg}" stroke="#000000" stroke-width="2"/>
      <circle cx="14" cy="14" r="5" fill="${dotColor}"/>
    </svg>
  `
  return L.divIcon({
    html: `<div style="filter: drop-shadow(${shadow})">${svg}</div>`,
    className: '',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    tooltipAnchor: [0, -36],
  })
}

export default function HotelMap({ windowId }) {
  const [selectedId, setSelectedId] = useState(null)
  const { addNotification, closeWindow } = useOS()

  const selectedHotel = HOTELS.find(h => h.id === selectedId)

  function handleSend() {
    if (!selectedHotel) return

    if (selectedHotel.correct) {
      completeObjective('obj-video-2')
      addMessage({
        id: `msg-hotel-${Date.now()}`,
        from: 'Capitaine Morel',
        role: 'Brigade Criminelle - Opérations',
        avatar: 'CM',
        subject: 'Re: Localisation reçue',
        date: new Date().toISOString(),
        body: `Agent,\n\nBon travail. L'Ibis est confirmé — nos équipes sont en route pour vérifier sur place.\n\nNe bougez pas, la suite arrive.\n\nCapitaine Morel`,
        readed: false,
        render: true,
      })
      if (windowId) closeWindow(windowId)
    } else {
      addNotification({
        id: `notif-wrong-hotel-${Date.now()}`,
        type: 'error',
        title: 'Mauvaise localisation',
        body: "Ce n'est pas le bon hôtel. Analysez à nouveau la vidéo.",
      })
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarIcon}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
        <span className={styles.toolbarTitle}>Hôtels de Lannion</span>
        <span className={styles.toolbarSub}>{HOTELS.length} établissements</span>
      </div>
      <div className={styles.mapWrapper}>
        <MapContainer
          center={[48.7317, -3.4568]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          zoomControl
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {HOTELS.map(hotel => (
            <Marker
              key={hotel.id}
              position={hotel.position}
              icon={createPinIcon(selectedId === hotel.id)}
              eventHandlers={{ click: () => setSelectedId(hotel.id) }}
            >
              <Tooltip direction="top" offset={[0, -4]} permanent={false}>
                {hotel.name}
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className={styles.footer}>
        <span className={styles.selected}>
          {selectedHotel
            ? <>Sélectionné : <span className={styles.selectedName}>{selectedHotel.name}</span></>
            : 'Cliquez sur un hôtel pour le sélectionner'}
        </span>
        <button
          className={styles.sendBtn}
          disabled={!selectedHotel}
          onClick={handleSend}
        >
          Envoyer cette localisation au Capitaine Morel
        </button>
      </div>
    </div>
  )
}
