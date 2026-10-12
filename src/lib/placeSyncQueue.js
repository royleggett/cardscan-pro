import { base44 } from "@/api/base44Client";

const QUEUE_KEY = "pending_places_queue";

/**
 * Geocode an address worldwide (with a UK-biased fallback for vague queries).
 * Shared by AddPlaceDialog, EditPlaceDialog and the offline sync queue.
 */
export async function geocodeAddress(address, placeName) {
  const queries = [
    address,
    placeName ? `${placeName}, ${address}` : null,
    `${address}, UK`,
  ].filter(Boolean);
  const postcodeMatch = address.match(/[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/i);
  if (postcodeMatch) queries.push(postcodeMatch[0]);

  for (const q of queries) {
    try {
      const encoded = encodeURIComponent(q);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1`, {
        headers: { 'Accept-Language': 'en' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const data = await resp.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        if (!isNaN(lat) && !isNaN(lon)) return { latitude: lat, longitude: lon };
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  }
  return null;
}

export function getPendingPlaces() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
}

function setQueue(items) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}

/** Save a place locally so it syncs when the device is back online. */
export function enqueuePlace(place) {
  const q = getPendingPlaces();
  q.push(place);
  setQueue(q);
  return q.length;
}

let isSyncing = false;

/** Upload every queued place. Skips geocoding for places that already have GPS coords. */
export async function processPlaceQueue() {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return { synced: 0, remaining: getPendingPlaces().length };
  }
  if (isSyncing) return { synced: 0, remaining: getPendingPlaces().length };
  isSyncing = true;

  const queue = getPendingPlaces();
  const remaining = [];
  let synced = 0;

  for (const item of queue) {
    try {
      let data = { ...item.data };
      if (!data.latitude && data.address && data.address.trim()) {
        const coords = await geocodeAddress(data.address, data.name);
        if (coords) data = { ...data, ...coords };
      }
      if (item.asUserEmail) {
        await base44.functions.invoke("createPlaceAsUser", {
          placeData: data,
          asUserEmail: item.asUserEmail
        });
      } else {
        await base44.entities.Place.create(data);
      }
      synced++;
    } catch (err) {
      console.error("Offline place sync failed:", err);
      remaining.push(item);
    }
  }

  setQueue(remaining);
  isSyncing = false;
  return { synced, remaining: remaining.length };
}