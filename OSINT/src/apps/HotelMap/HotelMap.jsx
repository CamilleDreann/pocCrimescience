import { useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { completeObjective } from "../../stores/objectivesStore";
import { addMessage } from "../../stores/messagesStore";
import { useOS } from "../../context/useOS";
import Popup from "../../components/ui/Popup";
import styles from "./HotelMap.module.css";

const HOTELS = [
  {
    id: "ibis-lannion",
    name: "Ibis Lannion",
    position: [48.7283, -3.4606],
    city: "Lannion",
    zone: "Sud",
    correct: true,
  },
  {
    id: "bretagne-lannion",
    name: "Hôtel de Bretagne",
    position: [48.7303, -3.4609],
    city: "Lannion",
    zone: "Sud",
  },
  {
    id: "ker-bugalic",
    name: "Hôtel Ker Bugalic",
    position: [48.7348, -3.46],
    city: "Lannion",
    zone: "Sud",
  },

  {
    id: "grand-hotel",
    name: "Grand Hôtel Perros-Guirec",
    position: [48.8159, -3.4589],
    city: "Perros-Guirec",
    zone: "Nord",
  },
  {
    id: "agapa",
    name: "L'Agapa Hôtel & Spa",
    position: [48.8183, -3.4497],
    city: "Perros-Guirec",
    zone: "Nord",
  },
  {
    id: "nautica",
    name: "Hôtel Le Nautica",
    position: [48.8033, -3.4435],
    city: "Perros-Guirec",
    zone: "Nord",
  },
  {
    id: "sternes",
    name: "Citôtel les Sternes",
    position: [48.7976, -3.4406],
    city: "Perros-Guirec",
    zone: "Nord",
  },
  {
    id: "hydrangeas",
    name: "Villa les Hydrangeas",
    position: [48.8188, -3.4391],
    city: "Perros-Guirec",
    zone: "Nord",
  },
  {
    id: "colombier",
    name: "Le Colombier Bretagne",
    position: [48.7803, -3.4325],
    city: "Louannec",
    zone: "Nord",
  },

  {
    id: "des-rochers",
    name: "Hôtel des Rochers",
    position: [48.8301, -3.4883],
    city: "Ploumanac'h",
    zone: "Côte de Granit Rose",
  },
  {
    id: "hotel-de-la-mer",
    name: "Hôtel Restaurant de la Mer",
    position: [48.8327, -3.5151],
    city: "Trégastel",
    zone: "Côte de Granit Rose",
  },
  {
    id: "beau-sejour",
    name: "Hôtel Le Beau Séjour",
    position: [48.833, -3.5147],
    city: "Trégastel",
    zone: "Côte de Granit Rose",
  },
  {
    id: "park-bellevue",
    name: "Park Hôtel Bellevue",
    position: [48.8292, -3.5148],
    city: "Trégastel",
    zone: "Côte de Granit Rose",
  },
  {
    id: "golf-st-samson",
    name: "Golfhôtel de Saint Samson",
    position: [48.8069, -3.519],
    city: "Pleumeur-Bodou",
    zone: "Côte de Granit Rose",
  },
];

function createPinIcon(selected) {
  const bg = "#d85E33";
  const shadow = selected ? "3px 3px 0 #000" : "2px 2px 0 #000";
  const dotColor = selected ? "#ffffff" : "#000000";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="-2 -2 32 40">
      <path d="M14 0C6.27 0 0 6.27 0 14c0 9.625 12.25 21.875 13.125 22.75a1.25 1.25 0 0 0 1.75 0C15.75 35.875 28 23.625 28 14 28 6.27 21.73 0 14 0z"
        fill="${bg}" stroke="#000000" stroke-width="2"/>
      <circle cx="14" cy="14" r="5" fill="${dotColor}"/>
    </svg>
  `;
  return L.divIcon({
    html: `<div style="width:28px;height:36px;filter:drop-shadow(${shadow});cursor:pointer;pointer-events:none">${svg}</div>`,
    className: "",
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    tooltipAnchor: [0, -36],
  });
}

export default function HotelMap({ windowId }) {
  const [selectedId, setSelectedId] = useState(null);
  const [errorPopup, setErrorPopup] = useState(false);
  const { closeWindow } = useOS();

  const selectedHotel = HOTELS.find((h) => h.id === selectedId);

  function handleSend() {
    if (!selectedHotel) return;

    if (selectedHotel.correct) {
      completeObjective("obj-video-2");
      addMessage({
        id: `msg-hotel-${Date.now()}`,
        from: "Capitaine Morel",
        role: "Brigade Criminelle - Opérations",
        avatar: "CM",
        subject: "Re: Localisation reçue",
        date: new Date().toISOString(),
        body: `Agent,<br/><br/>Votre excellent travail d'investigation a payé, puisque la piste de l'hôtel Ibis est désormais <strong>totalement confirmée</strong> par nos équipes déployées sur le terrain.<br/><br/><strong>ÉLÉMENTS RÉCUPÉRÉS SUR PLACE</strong><br/><br/><strong><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display:inline;vertical-align:middle;margin-right:4px"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg> Témoignage</strong><br/>La réceptionniste a formellement identifié notre suspect et confirmé son passage dans l'établissement.<br/><br/><strong><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display:inline;vertical-align:middle;margin-right:4px"><path d="M7 2v2h1v1.5c0 1.21.49 2.31 1.29 3.11L11 10.33V11H7v2h4v.67L9.29 15.4C8.49 16.2 8 17.3 8 18.5V20H7v2h10v-2h-1v-1.5c0-1.21-.49-2.31-1.29-3.11L13 13.67V13h4v-2h-4v-.67l1.71-1.71C15.51 7.81 16 6.71 16 5.5V4h1V2H7zm3 3.5V4h4v1.5c0 .65-.26 1.24-.69 1.67L12 8.48l-1.31-1.31C10.26 6.74 10 6.15 10 5.5z"/></svg> Traces ADN</strong><br/>Des punaises de lit découvertes dans sa chambre — opportunité inespérée pour isoler son empreinte génétique.<br/><br/><strong><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display:inline;vertical-align:middle;margin-right:4px"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg> Véhicule</strong><br/>Il se déplace à bord d'une <strong>Renault Modus</strong> — piste majeure pour la suite.<br/><br/><strong>PROCHAINE ÉTAPE — VIDÉOSURVEILLANCE</strong><br/><br/>Connectez-vous à l'application de vidéosurveillance et entrez le code d'autorisation :<br/><br/><strong>EE58fZ</strong><br/><br/>Utilisez cet accès pour traquer ce modèle sur le réseau de caméras de la ville et retrouver sa plaque d'immatriculation exacte.<br/><br/>Restez en position nous vous transmettrons la suite arrive très vite.<br/><br/><em>Capitaine Morel</em>`,
        objectives: [
          {
            id: "obj-camera-1",
            label:
              "Accéder au visualisateur de caméra et entrer le code EE58fZ",
          },
          {
            id: "obj-plate-1",
            label: "Trouver la plaque d'immatriculation de la Renault Modus",
          },
        ],
        readed: false,
        render: true,
      });
      if (windowId) closeWindow(windowId);
    } else {
      setErrorPopup(true);
    }
  }

  return (
    <div className={styles.container}>
      {errorPopup && (
        <Popup
          type="error"
          title="Mauvaise localisation"
          message="Ce n'est pas le bon hôtel. Analysez à nouveau la vidéo."
          onClose={() => setErrorPopup(false)}
        />
      )}
      <div className={styles.toolbar}>
        <div className={styles.toolbarIcon}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
        <span className={styles.toolbarTitle}>Hôtels</span>
        <span className={styles.toolbarSub}>
          {HOTELS.length} établissements
        </span>
      </div>
      <div className={styles.mapWrapper}>
        <MapContainer
          center={[48.77, -3.4]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          zoomControl
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {HOTELS.map((hotel) => (
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
          {selectedHotel ? (
            <>
              Sélectionné :{" "}
              <span className={styles.selectedName}>{selectedHotel.name}</span>
            </>
          ) : (
            "Cliquez sur un hôtel pour le sélectionner"
          )}
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
  );
}
