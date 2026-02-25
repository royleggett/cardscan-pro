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

    // Use the user's own Resend credentials
    const resendApiKey = user.resend_api_key;
    // Only use the saved from email if it looks valid (not a placeholder or unverified domain)
    const savedFrom = user.resend_from_email;
    const fromEmail = (savedFrom && savedFrom.trim()) ? savedFrom.trim() : "onboarding@resend.dev";

    if (!resendApiKey) {
      return Response.json({ error: 'Email not configured. Please add your Resend API key in Email Settings.' }, { status: 400 });
    }

    // Load custom template if one exists (scoped to this user)
    const templates = await base44.entities.EmailTemplate.filter({ template_key: "thank_you", created_by: user.email });
    const subjectTemplate = templates.length > 0 ? templates[0].subject : DEFAULT_SUBJECT;
    const bodyTemplate = templates.length > 0 ? templates[0].body : DEFAULT_BODY;

    const vars = { contactName, exhibitionName, senderName };
    const subject = applyPlaceholders(subjectTemplate, vars);
    const body = applyPlaceholders(bodyTemplate, vars);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [contactEmail],
        subject,
        text: body
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return Response.json({ error: data.message || "Failed to send email" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});