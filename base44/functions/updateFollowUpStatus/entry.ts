import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const { contact_id, action } = body;

    if (!contact_id) {
      return Response.json({ error: "Missing contact_id" }, { status: 400 });
    }

    // Use service role — this endpoint is called from email links without user auth
    const contacted = action === "yes";

    await base44.asServiceRole.entities.Contact.update(contact_id, {
      follow_up_contacted: contacted
    });

    return Response.json({ success: true, contacted });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});