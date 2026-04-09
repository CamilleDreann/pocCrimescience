import { useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
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

const ACCENT = '#d85E33'
const DEFAULT_COLOR = '#5a8dee'

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
      closeWindow(windowId)
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
      <div className={styles.mapWrapper}>
        <MapContainer
          center={[48.7317, -3.4568]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          zoomControl
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {HOTELS.map(hotel => (
            <CircleMarker
              key={hotel.id}
              center={hotel.position}
              radius={10}
              pathOptions={{
                color: selectedId === hotel.id ? ACCENT : DEFAULT_COLOR,
                fillColor: selectedId === hotel.id ? ACCENT : DEFAULT_COLOR,
                fillOpacity: 0.85,
                weight: 2,
              }}
              eventHandlers={{ click: () => setSelectedId(hotel.id) }}
            >
              <Tooltip direction="top" offset={[0, -10]} permanent={false}>
                {hotel.name}
              </Tooltip>
            </CircleMarker>
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
