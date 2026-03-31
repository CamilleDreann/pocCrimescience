#!/usr/bin/env node
/**
 * generate-routes.js
 *
 * Replaces fake interpolated coordinates in users.json with real road/path
 * geometry fetched from the OSRM public API (no API key required).
 *
 * Usage:
 *   node api/scripts/generate-routes.js
 *
 * OSRM profiles used:
 *   - Run / Hike → "foot"
 *   - Ride       → "bike"
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "../data/users.json");

const OSRM_BASE = "https://router.project-osrm.org/route/v1";

/** Map Strava activity type → OSRM profile */
function osrmProfile(activityType) {
  if (activityType === "Ride") return "bike";
  return "foot"; // Run, Hike, Walk, …
}

/**
 * Fetch a real-road route from OSRM.
 * @param {[number, number][]} waypoints  Array of [lat, lng] (Leaflet order)
 * @param {string}             profile    "foot" | "bike" | "car"
 * @returns {Promise<[number, number][]>} Array of [lat, lng] coordinates
 */
async function fetchRoute(waypoints, profile) {
  // OSRM expects coordinates as "lng,lat" pairs joined by ";"
  const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(";");
  const url = `${OSRM_BASE}/${profile}/${coords}?geometries=geojson&overview=full`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM responded ${res.status} for ${url}`);

  const json = await res.json();

  if (json.code !== "Ok" || !json.routes?.length) {
    throw new Error(`OSRM returned code="${json.code}" — no route found`);
  }

  // GeoJSON geometry coordinates are [lng, lat] — convert back to [lat, lng]
  return json.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
}

/** Sleep helper to avoid hammering the public API */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));

  let updatedActivities = 0;

  for (const user of data) {
    for (const platform of user.platforms ?? []) {
      if (platform.name !== "Strava" || !platform.activities?.length) continue;

      console.log(`\n👤 ${user.name} — ${platform.username}`);

      for (const activity of platform.activities) {
        const profile = osrmProfile(activity.type);
        console.log(
          `  ↳ [${activity.type}] "${activity.name}" (${activity.coordinates.length} waypoints, profile=${profile})`
        );

        try {
          const realCoords = await fetchRoute(activity.coordinates, profile);
          activity.coordinates = realCoords;
          updatedActivities++;
          console.log(`     ✓ ${realCoords.length} points récupérés`);
        } catch (err) {
          console.error(`     ✗ Erreur : ${err.message}`);
          console.error(`       Les coordonnées existantes sont conservées.`);
        }

        // Be polite to the public OSRM instance
        await sleep(500);
      }
    }
  }

  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
  console.log(
    `\n✅ Terminé — ${updatedActivities} activité(s) mise(s) à jour dans users.json`
  );
}

main().catch((err) => {
  console.error("Erreur fatale :", err);
  process.exit(1);
});
