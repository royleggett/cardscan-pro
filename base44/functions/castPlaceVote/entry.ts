import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { placeId, rating } = await req.json();
    if (!placeId || !rating) return Response.json({ error: 'Missing placeId or rating' }, { status: 400 });

    // Find the user's existing rating for this place (service role bypasses RLS)
    const existing = await base44.asServiceRole.entities.PlaceRating.filter({
      place_id: placeId,
      user_email: user.email
    });

    let userRating = null;

    if (existing.length > 0) {
      const existingRating = existing[0];
      if (existingRating.rating === rating) {
        // Remove rating if clicking same button
        await base44.asServiceRole.entities.PlaceRating.delete(existingRating.id);
        userRating = null;
      } else {
        // Update to opposite rating
        await base44.asServiceRole.entities.PlaceRating.update(existingRating.id, { rating });
        userRating = rating;
      }
    } else {
      // Create new rating
      await base44.asServiceRole.entities.PlaceRating.create({
        place_id: placeId,
        user_email: user.email,
        rating
      });
      userRating = rating;
    }

    // Count all ratings for this place
    const allRatings = await base44.asServiceRole.entities.PlaceRating.filter({ place_id: placeId });
    const upvotes = allRatings.filter(r => r.rating === "up").length;
    const downvotes = allRatings.filter(r => r.rating === "down").length;

    // Auto-flag if downvotes exceed threshold
    const shouldFlag = downvotes >= 5 && downvotes > upvotes * 2;

    // Update the place with new vote counts
    await base44.asServiceRole.entities.Place.update(placeId, {
      community_upvotes: upvotes,
      community_downvotes: downvotes,
      is_flagged: shouldFlag
    });

    return Response.json({
      success: true,
      userRating,
      community_upvotes: upvotes,
      community_downvotes: downvotes
    });
  } catch (error) {
    console.error("Error casting vote:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});