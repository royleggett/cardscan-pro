import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Try multiple geocoding strategies for a given address + place name
async function geocodeWithFallbacks(address, placeName) {
  const queries = [
    address,
    `${address}, UK`,
    placeName ? `${placeName}, ${address}` : null,
    placeName ? `${placeName}, ${address}, UK` : null,
  ].filter(Boolean);

  // Try extracting a UK postcode (e.g. "NN17 3DY")
  const postcodeMatch = address.match(/[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/i);
  if (postcodeMatch) {
    queries.push(postcodeMatch[0]);
    queries.push(`${postcodeMatch[0]}, UK`);
  }

  for (const q of queries) {
    try {
      const encoded = encodeURIComponent(q);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1&countrycodes=gb`;
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'CardScanPro/1.0 (geocoding)' }
      });
      const data = await resp.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        if (!isNaN(lat) && !isNaN(lon)) {
          return { lat, lon, matchedQuery: q };
        }
      }
      // Respect Nominatim rate limit between attempts
      await new Promise(resolve => setTimeout(resolve, 1100));
    } catch (err) {
      // try next strategy
    }
  }

  // Final fallback: try without country restriction
  for (const q of [address, placeName ? `${placeName}, ${address}` : null].filter(Boolean)) {
    try {
      const encoded = encodeURIComponent(q);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1`;
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'CardScanPro/1.0 (geocoding)' }
      });
      const data = await resp.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        if (!isNaN(lat) && !isNaN(lon)) {
          return { lat, lon, matchedQuery: q };
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1100));
    } catch (err) {
      // continue
    }
  }

  return null;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    // Fetch all places
    let allPlaces = [];
    let hasMore = true;
    let offset = 0;
    const pageSize = 100;
    while (hasMore) {
      const batch = await base44.asServiceRole.entities.Place.list('-created_date', pageSize, offset);
      allPlaces = allPlaces.concat(batch);
      hasMore = batch.length === pageSize;
      offset += pageSize;
    }

    // Find places missing coordinates that have an address
    const needsGeocoding = allPlaces.filter(p =>
      p.address && p.address.trim().length > 0 &&
      (p.latitude === undefined || p.latitude === null || p.longitude === undefined || p.longitude === null)
    );

    let geocoded = 0;
    let failed = 0;
    const errors = [];

    for (const place of needsGeocoding) {
      const result = await geocodeWithFallbacks(place.address, place.name);

      if (result) {
        await base44.asServiceRole.entities.Place.update(place.id, { latitude: result.lat, longitude: result.lon });
        geocoded++;
      } else {
        failed++;
        errors.push({ id: place.id, name: place.name, address: place.address });
      }
    }

    return Response.json({
      total_places: allPlaces.length,
      needed_geocoding: needsGeocoding.length,
      geocoded,
      failed,
      errors: errors.slice(0, 20)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});