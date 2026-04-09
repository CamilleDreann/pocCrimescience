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

const RunIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/></svg>;
const RideIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6l-2.2-2.5zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/></svg>;
const HikeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7z"/></svg>;

const TYPE_ICONS = {
  Run: <RunIcon />,
  Ride: <RideIcon />,
  Hike: <HikeIcon />,
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
                {TYPE_ICONS[activity.type] ?? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/></svg>}
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
