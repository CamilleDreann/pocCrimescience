import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./StravaViewer.module.css";

// Fix Leaflet default marker icon broken by Vite bundling
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const TYPE_ICONS = {
  Run: "🏃",
  Ride: "🚴",
  Hike: "🥾",
};

function getInitials(username) {
  const clean = username.replace(/^@/, "");
  const parts = clean.split(/[._]/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return clean.slice(0, 2).toUpperCase();
}

// Inner component: fits map bounds whenever selectedActivity changes
function MapFitter({ coordinates }) {
  const map = useMap();
  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      map.fitBounds(coordinates, { padding: [30, 30] });
    }
  }, [coordinates, map]);
  return null;
}

export default function StravaViewer({ profile }) {
  const activities = profile.activities ?? [];
  const [selectedId, setSelectedId] = useState(activities[0]?.id ?? null);

  const selectedActivity = activities.find((a) => a.id === selectedId) ?? null;
  const initials = getInitials(profile.username);

  // Default map center: centroid of first activity, or fallback to France
  const defaultCenter = activities[0]?.coordinates?.[0] ?? [46.5, 2.35];

  return (
    <div className={styles.container}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <svg
            className={styles.stravaLogo}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
          </svg>
          <span className={styles.topBarTitle}>Strava</span>
        </div>
      </div>

      {/* Profile header */}
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.profileInfo}>
          <p className={styles.profileName}>{profile.username}</p>
          <p className={styles.profileBio}>{profile.bio}</p>
        </div>
        <div className={styles.profileStats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{profile.totalActivities}</span>
            <span className={styles.statLabel}>Activités</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{profile.totalKm} km</span>
            <span className={styles.statLabel}>Total</span>
          </div>
        </div>
      </div>

      {/* Main layout: list + map */}
      <div className={styles.mainLayout}>
        {/* Activity list */}
        <div className={styles.activityList}>
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`${styles.activityItem} ${activity.id === selectedId ? styles.selected : ""}`}
              onClick={() => setSelectedId(activity.id)}
            >
              <span className={styles.activityIcon}>
                {TYPE_ICONS[activity.type] ?? "🏅"}
              </span>
              <p className={styles.activityName}>{activity.name}</p>
              <div className={styles.activityMeta}>
                <span>{activity.distance}</span>
                <span>{activity.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className={styles.mapPanel}>
          <MapContainer
            center={defaultCenter}
            zoom={13}
            style={{ width: "100%", height: "100%" }}
            zoomControl={true}
          >
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {selectedActivity && (
              <>
                <Polyline
                  positions={selectedActivity.coordinates}
                  pathOptions={{ color: "#FC4C02", weight: 4, opacity: 0.9 }}
                />
                <MapFitter coordinates={selectedActivity.coordinates} />
              </>
            )}
          </MapContainer>
          {!selectedActivity && (
            <div className={styles.noActivity}>Sélectionner une activité</div>
          )}
        </div>
      </div>
    </div>
  );
}
