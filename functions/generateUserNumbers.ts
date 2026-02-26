import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const allUsers = await base44.asServiceRole.entities.User.list();
    let updated = 0;

    for (const u of allUsers) {
      if (!u.user_number) {
        let code = generateRandomCode();
        let codeExists = true;
        
        while (codeExists) {
          const existing = allUsers.filter(usr => usr.user_number === code);
          codeExists = existing.length > 0;
          if (codeExists) code = generateRandomCode();
        }

        await base44.asServiceRole.entities.User.update(u.id, { user_number: code });
        updated++;
      }
    }

    return Response.json({ success: true, updated, total: allUsers.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});