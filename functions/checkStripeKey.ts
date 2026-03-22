import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const key = Deno.env.get('STRIPE_SECRET_KEY');
    
    return Response.json({ 
      exists: !!key,
      prefix: key ? key.substring(0, 8) : 'none',
      length: key ? key.length : 0
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});