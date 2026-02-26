import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const MILESTONES = [
  { entries: 10, badge: "Starter" },
  { entries: 25, badge: "Contributor" },
  { entries: 50, badge: "Gold Member", discount: 10 },
  { entries: 75, badge: "Platinum", discount: 20 }
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

    const totalEntries = contacts.length + places.length;
    const userData = await base44.auth.me();
    const users = await base44.entities.User.filter({ email });
    
    if (users.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const userRecord = users[0];
    const newBadges = userData?.badges_earned || [];
    let newDiscount = 0;

    for (const milestone of MILESTONES) {
      if (totalEntries >= milestone.entries && !newBadges.includes(milestone.badge)) {
        newBadges.push(milestone.badge);
      }
      if (totalEntries >= milestone.entries && milestone.discount) {
        newDiscount = Math.max(newDiscount, milestone.discount);
      }
    }

    await base44.asServiceRole.entities.User.update(userRecord.id, {
      total_entries: totalEntries,
      badges_earned: newBadges,
      discount_tier: newDiscount
    });

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