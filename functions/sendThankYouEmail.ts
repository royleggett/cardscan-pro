import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { contactEmail, contactName, exhibitionName, senderName } = await req.json();

    if (!contactEmail) return Response.json({ error: 'No email provided' }, { status: 400 });

    const body = `Dear ${contactName || "Visitor"},

Thank you for visiting us at ${exhibitionName || "our exhibition"}. It was a pleasure meeting you!

We hope you enjoyed the event and found our time together valuable. We will be in touch soon.

Warm regards,
${senderName || "The Team"}`;

    await base44.integrations.Core.SendEmail({
      to: contactEmail,
      subject: `Thank you for visiting us at ${exhibitionName || "our exhibition"}`,
      body
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});