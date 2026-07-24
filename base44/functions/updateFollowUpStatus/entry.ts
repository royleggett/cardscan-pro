import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let contactId, action;

    if (req.method === 'GET') {
      // From email link click
      const url = new URL(req.url);
      contactId = url.searchParams.get('contact_id');
      action = url.searchParams.get('action');
    } else {
      // POST from frontend
      const body = await req.json();
      contactId = body.contact_id;
      action = body.action;
    }

    if (!contactId) {
      return new Response('Missing contact_id', { status: 400 });
    }

    const contacted = action === 'yes';

    await base44.asServiceRole.entities.Contact.update(contactId, {
      follow_up_contacted: contacted
    });

    // Return simple HTML page for email link clicks (GET)
    if (req.method === 'GET') {
      const html = contacted
        ? `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,sans-serif;">
<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:24px;text-align:center;">
  <div style="width:64px;height:64px;border-radius:50%;background:#dcfce7;display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
    <span style="font-size:32px;">✓</span>
  </div>
  <h1 style="margin:0 0 8px 0;font-size:22px;color:#16a34a;">Marked as Contacted</h1>
  <p style="color:#6b7280;font-size:15px;margin:0;">Great work following up on this lead!</p>
  <p style="color:#9ca3af;font-size:13px;margin-top:24px;">You can close this page and return to CardScan-Pro to see your updated contacts.</p>
</div></body></html>`
        : `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,sans-serif;">
<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:24px;text-align:center;">
  <div style="width:64px;height:64px;border-radius:50%;background:#f3f4f6;display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
    <span style="font-size:32px;">📋</span>
  </div>
  <h1 style="margin:0 0 8px 0;font-size:22px;color:#374151;">Noted</h1>
  <p style="color:#6b7280;font-size:15px;margin:0;">We'll leave this lead as-is for now.</p>
  <p style="color:#9ca3af;font-size:13px;margin-top:24px;">You can close this page and return to CardScan-Pro anytime.</p>
</div></body></html>`;

      return new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    return Response.json({ success: true, contacted });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});