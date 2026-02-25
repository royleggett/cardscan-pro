import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const DEFAULT_SUBJECT = `Thank you for visiting us at {exhibition_name}`;
const DEFAULT_BODY = `Dear {contact_name},

Thank you for visiting us at {exhibition_name}. It was a pleasure meeting you!

We hope you enjoyed the event and found our time together valuable. We will be in touch soon.

Warm regards,
{sender_name}`;

function applyPlaceholders(text, vars) {
  return text
    .replace(/{contact_name}/g, vars.contactName || "Visitor")
    .replace(/{exhibition_name}/g, vars.exhibitionName || "our exhibition")
    .replace(/{sender_name}/g, vars.senderName || "The Team");
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { contactEmail, contactName, exhibitionName, senderName } = await req.json();

    if (!contactEmail) return Response.json({ error: 'No email provided' }, { status: 400 });

    // Load custom template if one exists
    const templates = await base44.entities.EmailTemplate.filter({ template_key: "thank_you" });
    const subjectTemplate = templates.length > 0 ? templates[0].subject : DEFAULT_SUBJECT;
    const bodyTemplate = templates.length > 0 ? templates[0].body : DEFAULT_BODY;

    const vars = { contactName, exhibitionName, senderName };
    const subject = applyPlaceholders(subjectTemplate, vars);
    const body = applyPlaceholders(bodyTemplate, vars);

    await base44.integrations.Core.SendEmail({ to: contactEmail, subject, body });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});