import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { rating, message, category } = await req.json();

    if (!message?.trim()) return Response.json({ error: 'Message is required' }, { status: 400 });

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) return Response.json({ error: 'Email service not configured' }, { status: 500 });

    const stars = '⭐'.repeat(rating || 0);
    const categoryLabel = category || 'General';

    const htmlBody = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:36px 32px;text-align:center;">
            <div style="font-size:40px;margin-bottom:12px;">💬</div>
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">New Feedback from CardScanner Pro</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">From</p>
            <p style="margin:0 0 24px;color:#111;font-size:16px;font-weight:600;">${user.full_name} &lt;${user.email}&gt;</p>

            <p style="margin:0 0 8px;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Category</p>
            <p style="margin:0 0 24px;color:#111;font-size:16px;">${categoryLabel}</p>

            <p style="margin:0 0 8px;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Rating</p>
            <p style="margin:0 0 24px;font-size:20px;">${stars || 'No rating given'} ${rating ? `(${rating}/5)` : ''}</p>

            <p style="margin:0 0 8px;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
            <div style="background:#f9fafb;border-left:4px solid #3b82f6;padding:16px;border-radius:8px;">
              <p style="margin:0;color:#333;font-size:15px;line-height:1.7;">${message.replace(/\n/g, '<br>')}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;color:#999;font-size:13px;">Sent via CardScanner Pro</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "CardScanner Pro <hello@cardscan-pro.com>",
        to: ["support@cardscan-pro.com"],
        reply_to: user.email,
        subject: `[Feedback] ${categoryLabel} — ${stars || 'No rating'} from ${user.full_name}`,
        html: htmlBody
      })
    });

    const data = await res.json();
    if (!res.ok) return Response.json({ error: data.message || "Failed to send" }, { status: 500 });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});