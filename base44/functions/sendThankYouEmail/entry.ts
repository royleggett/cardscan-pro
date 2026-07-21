import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

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

    const { contactEmail, contactName, exhibitionName, senderName, contactId } = await req.json();

    if (!contactEmail) return Response.json({ error: 'No email provided' }, { status: 400 });

    // Load custom template if one exists (scoped to this user)
    const templates = await base44.entities.EmailTemplate.filter({ template_key: "thank_you", created_by: user.email });
    const subjectTemplate = templates.length > 0 ? templates[0].subject : DEFAULT_SUBJECT;
    const bodyTemplate = templates.length > 0 ? templates[0].body : DEFAULT_BODY;

    const vars = { contactName, exhibitionName, senderName };
    const subject = applyPlaceholders(subjectTemplate, vars);
    const body = applyPlaceholders(bodyTemplate, vars);

    const htmlBody = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:36px 32px;text-align:center;">
            <div style="font-size:40px;margin-bottom:12px;">🤝</div>
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Great meeting you!</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            ${body.split('\n').filter(l => l.trim()).map(line => `<p style="margin:0 0 16px;color:#444;font-size:15px;line-height:1.7;">${line}</p>`).join('')}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;color:#999;font-size:13px;">Sent via CardScan-Pro</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // Send via Resend directly (Base44's built-in service only allows sending to app users)
    try {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (!resendApiKey) {
        return Response.json({ error: "RESEND_API_KEY secret is not set" }, { status: 500 });
      }

      const fromName = senderName || user.full_name || "CardScan-Pro";
      const fromAddress = "noreply@cardscan-pro.com";

      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: `${fromName} <${fromAddress}>`,
          to: [contactEmail],
          subject,
          html: htmlBody
        })
      });

      const emailResult = await resendResponse.json();

      if (!resendResponse.ok) {
        console.error("Resend error:", JSON.stringify(emailResult));
        return Response.json({ error: "Failed to send email", details: emailResult }, { status: 500 });
      }

      console.log("Email sent successfully via Resend:", JSON.stringify(emailResult));

      // Mark contact as having received thank you email
      if (contactId) {
        await base44.entities.Contact.update(contactId, { thank_you_sent: true });
      }

      return Response.json({ success: true, details: emailResult });
    } catch (emailError) {
      console.error("Email send error:", emailError.message, JSON.stringify(emailError));
      return Response.json({ error: "Failed to send email", details: emailError.message }, { status: 500 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});