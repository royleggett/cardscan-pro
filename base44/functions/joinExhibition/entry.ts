import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { teamCode } = await req.json();
    if (!teamCode) return Response.json({ error: 'No team code provided' }, { status: 400 });

    const trimmedCode = teamCode.trim().toUpperCase();

    // Find exhibition by team code (service role bypasses RLS)
    const matches = await base44.asServiceRole.entities.Exhibition.filter({ team_code: trimmedCode });
    if (matches.length === 0) {
      return Response.json({ error: 'Code not found. Please check and try again.' }, { status: 404 });
    }

    const exhibition = matches[0];

    if (exhibition.created_by === user.email) {
      return Response.json({ error: "You created this exhibition — you're already the owner!" }, { status: 400 });
    }

    const currentMembers = exhibition.team_members || [];
    if (currentMembers.includes(user.email)) {
      return Response.json({ error: "You've already joined this exhibition." }, { status: 400 });
    }

    // Add user to exhibition's team_members
    const updatedMembers = [...currentMembers, user.email];
    await base44.asServiceRole.entities.Exhibition.update(exhibition.id, {
      team_members: updatedMembers
    });

    // Add user to all contacts in this exhibition
    const contacts = await base44.asServiceRole.entities.Contact.filter({ exhibition_id: exhibition.id });
    const contactsToUpdate = contacts.filter(c => !(c.team_members || []).includes(user.email));
    if (contactsToUpdate.length > 0) {
      await base44.asServiceRole.entities.Contact.bulkUpdate(
        contactsToUpdate.map(c => ({ id: c.id, team_members: [...(c.team_members || []), user.email] }))
      );
    }

    // Add user to all places in this exhibition
    const places = await base44.asServiceRole.entities.Place.filter({ exhibition_id: exhibition.id });
    const placesToUpdate = places.filter(p => !(p.team_members || []).includes(user.email));
    if (placesToUpdate.length > 0) {
      await base44.asServiceRole.entities.Place.bulkUpdate(
        placesToUpdate.map(p => ({ id: p.id, team_members: [...(p.team_members || []), user.email] }))
      );
    }

    return Response.json({ success: true, exhibition });
  } catch (error) {
    console.error("Error joining exhibition:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});