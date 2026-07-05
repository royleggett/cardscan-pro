import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    // Fetch all places using service role (community places from all users)
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
      try {
        // Nominatim requires a descriptive User-Agent header
        const query = encodeURIComponent(place.address);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;
        const resp = await fetch(url, {
          headers: { 'User-Agent': 'CardScanPro/1.0 (geocoding)' }
        });
        const data = await resp.json();

        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          if (!isNaN(lat) && !isNaN(lon)) {
            await base44.asServiceRole.entities.Place.update(place.id, { latitude: lat, longitude: lon });
            geocoded++;
          } else {
            failed++;
            errors.push({ id: place.id, name: place.name, error: 'Invalid coordinates returned' });
          }
        } else {
          failed++;
          errors.push({ id: place.id, name: place.name, error: 'No match found for address' });
        }

        // Respect Nominatim rate limit (max 1 request per second)
        await new Promise(resolve => setTimeout(resolve, 1100));
      } catch (err) {
        failed++;
        errors.push({ id: place.id, name: place.name, error: err.message });
      }
    }

    return Response.json({
      total_places: allPlaces.length,
      needed_geocoding: needsGeocoding.length,
      geocoded,
      failed,
      errors: errors.slice(0, 20) // cap error list
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});