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

    // Create the place as the specified user using service role
    const place = await base44.asServiceRole.entities.Place.create({
      ...placeData,
      created_by: asUserEmail
    });

    return Response.json({ success: true, place });
  } catch (error) {
    console.error("Error creating place:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});