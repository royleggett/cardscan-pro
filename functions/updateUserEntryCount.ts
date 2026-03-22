import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

const MILESTONES = [
  { entries: 25, badge: "Starter" },
  { entries: 50, badge: "Contributor" },
  { entries: 75, badge: "Bronze Member", discount: 5 },
  { entries: 100, badge: "Silver Member", discount: 10 },
  { entries: 150, badge: "Gold Member", discount: 15 },
  { entries: 200, badge: "Platinum", discount: 20 },
  { entries: 500, badge: "Elite", discount: 50 },
  { entries: 1000, badge: "VIP", subscription: "free_year" }
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email } = user;

    const [contacts, places] = await Promise.all([
      base44.entities.Contact.filter({ created_by: email }),
      base44.entities.Place.filter({ created_by: email })
    ]);

    // Calculate trust score for places
    let qualityScore = 0;
    for (const place of places.filter(p => p.is_public)) {
      const upvotes = place.community_upvotes || 0;
      const downvotes = place.community_downvotes || 0;
      qualityScore += upvotes - downvotes;
    }

    // Only count quality places (not flagged) for rewards
    const qualityPlaces = places.filter(p => !p.is_flagged);
    const totalEntries = contacts.length + qualityPlaces.length;
    const userData = await base44.auth.me();
    const users = await base44.entities.User.filter({ email });
    
    if (users.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const userRecord = users[0];
    const newBadges = userData?.badges_earned || [];
    let newDiscount = 0;
    let subscriptionStatus = null;

    for (const milestone of MILESTONES) {
      if (totalEntries >= milestone.entries && !newBadges.includes(milestone.badge)) {
        newBadges.push(milestone.badge);
      }
      if (totalEntries >= milestone.entries && milestone.discount) {
        newDiscount = Math.max(newDiscount, milestone.discount);
      }
      if (totalEntries >= milestone.entries && milestone.subscription) {
        subscriptionStatus = milestone.subscription;
      }
    }

    const updateData = {
      total_entries: totalEntries,
      badges_earned: newBadges,
      discount_tier: newDiscount,
      trust_score: qualityScore
    };

    if (subscriptionStatus) {
      updateData.subscription_status = subscriptionStatus;
    }

    await base44.asServiceRole.entities.User.update(userRecord.id, updateData);

    return Response.json({ 
      success: true, 
      total_entries: totalEntries,
      badges_earned: newBadges,
      discount_tier: newDiscount
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});