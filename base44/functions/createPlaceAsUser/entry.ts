import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Only admins can use this function
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { placeData, asUserEmail } = await req.json();

    // Map fictional user emails to consistent IDs
    const fictionalUserIds = {
      "sarah.mitchell@demo.app": "fictional-user-2847",
      "james.chen@demo.app": "fictional-user-3921",
      "maria.rodriguez@demo.app": "fictional-user-1563",
      "david.thompson@demo.app": "fictional-user-4205",
      "emily.watson@demo.app": "fictional-user-2674"
    };

    // Create the place using service role, storing the phantom identity in a dedicated field
    // (created_by is controlled by the platform and cannot be overridden)
    const place = await base44.asServiceRole.entities.Place.create({
      ...placeData,
      phantom_created_by: asUserEmail
    });

    return Response.json({ success: true, place });
  } catch (error) {
    console.error("Error creating place:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});