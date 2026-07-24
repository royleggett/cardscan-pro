import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const appUrl = Deno.env.get("BASE44_APP_URL") || new URL(req.url).origin;

    // This runs as a scheduled job via service role
    const allUsers = await base44.asServiceRole.entities.User.list();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log(`Processing ${allUsers.length} users. Today is: ${today.toISOString()}`);

    let totalSent = 0;

    for (const user of allUsers) {
      if (!user.email) continue;

      // Build list of lead types this user wants reminders for
      const leadTypes = [];
      if (user.followup_remind_hot) leadTypes.push({ type: "hot", days: user.followup_days_hot ?? 1, label: "🔥 Hot" });
      if (user.followup_remind_warm) leadTypes.push({ type: "warm", days: user.followup_days_warm ?? 3, label: "🌡️ Warm" });
      if (user.followup_remind_cool) leadTypes.push({ type: "cool", days: user.followup_days_cool ?? 7, label: "❄️ Cool" });

      console.log(`User ${user.email}: leadTypes = ${JSON.stringify(leadTypes)}`);

      if (leadTypes.length === 0) {
        console.log(`User ${user.email}: No lead types configured, skipping`);
        continue;
      }

      // Get all contacts for this user (owned + team)
      const ownedContacts = await base44.asServiceRole.entities.Contact.filter({ created_by_id: user.id });
      const teamContacts = await base44.asServiceRole.entities.Contact.filter({ team_members: user.email });
      const contactMap = {};
      [...ownedContacts, ...teamContacts].forEach(c => { contactMap[c.id] = c; });
      const contacts = Object.values(contactMap);

      // Get all exhibitions for this user (owned + team)
      const ownedExhibitions = await base44.asServiceRole.entities.Exhibition.filter({ created_by_id: user.id });
      const teamExhibitions = await base44.asServiceRole.entities.Exhibition.filter({ team_members: user.email });
      const exhibitionMap = {};
      [...ownedExhibitions, ...teamExhibitions].forEach(ex => { exhibitionMap[ex.id] = ex; });

      console.log(`User ${user.email}: ${contacts.length} contacts, ${Object.keys(exhibitionMap).length} exhibitions`);

      // Find contacts due for follow-up (based on lead scan date + N days)
      const dueContacts = [];

      for (const contact of contacts) {
        if (!contact.follow_up_type || contact.follow_up_type === "none") continue;
        if (contact.follow_up_reminder_sent) continue;

        const matchingRule = leadTypes.find(lt => lt.type === contact.follow_up_type);
        if (!matchingRule) continue;

        if (!contact.created_date) continue;

        const scanDate = new Date(contact.created_date);
        scanDate.setHours(0, 0, 0, 0);

        const reminderDate = new Date(scanDate);
        reminderDate.setDate(reminderDate.getDate() + matchingRule.days);

        console.log(`Contact ${contact.full_name}: type=${contact.follow_up_type}, scan date=${scanDate.toISOString()}, reminder date=${reminderDate.toISOString()}, due=${reminderDate.getTime() <= today.getTime()}`);

        if (reminderDate.getTime() <= today.getTime()) {
          dueContacts.push({
            contact,
            exhibition: exhibitionMap[contact.exhibition_id],
            label: matchingRule.label
          });
        }
      }

      if (dueContacts.length === 0) {
        console.log(`User ${user.email}: No contacts due today`);
        continue;
      }

      console.log(`User ${user.email}: ${dueContacts.length} contacts due for follow-up`);

      // Group by lead type
      const grouped = {};
      for (const item of dueContacts) {
        if (!grouped[item.label]) grouped[item.label] = [];
        grouped[item.label].push(item);
      }

      // Build HTML email body with YES/NO follow-up buttons
      let htmlBody = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="margin-bottom:8px;">📋 Follow-up Reminder</h2>
        <p style="color:#6b7280;margin-bottom:24px;">You have ${dueContacts.length} contact${dueContacts.length !== 1 ? "s" : ""} due for follow-up:</p>`;

      for (const [label, items] of Object.entries(grouped)) {
        htmlBody += `<h3 style="margin:16px 0 8px 0;">${label} Leads</h3>`;
        for (const { contact, exhibition } of items) {
          const contactInfo = [
            contact.company || null,
            exhibition?.name || null,
            contact.email || null,
            contact.phone_mobile || null
          ].filter(Boolean).join(" · ");

          const yesUrl = `${appUrl}/FollowUpResponse?contact_id=${contact.id}&action=yes`;
          const noUrl = `${appUrl}/FollowUpResponse?contact_id=${contact.id}&action=no`;

          htmlBody += `<div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:12px;">
            <p style="margin:0 0 4px 0;font-weight:bold;">${contact.full_name}</p>
            <p style="margin:0 0 12px 0;color:#6b7280;font-size:14px;">${contactInfo}</p>
            <p style="margin:0;font-size:14px;">Have you contacted them?
              <a href="${yesUrl}" style="background:#16a34a;color:white;padding:6px 16px;text-decoration:none;border-radius:6px;margin-left:8px;font-weight:bold;">YES</a>
              <a href="${noUrl}" style="background:#d1d5db;color:#374151;padding:6px 16px;text-decoration:none;border-radius:6px;margin-left:4px;font-weight:bold;">NO</a>
            </p>
          </div>`;
        }
      }

      htmlBody += `<p style="margin-top:24px;color:#6b7280;font-size:14px;">Log in to CardScan-Pro to manage your contacts.</p></div>`;

      try {
        const fullHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:28px 32px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">📋 Follow-up Reminder</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            ${htmlBody}
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;color:#999;font-size:13px;">Sent via CardScan-Pro</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

        const emailResult = await base44.integrations.Core.SendEmail({
          to: user.email,
          subject: `📋 Follow-up reminder: ${dueContacts.length} lead${dueContacts.length !== 1 ? "s" : ""} due today`,
          body: fullHtml,
          from_name: "CardScan-Pro"
        });

        console.log(`Email sent to ${user.email} via Base44 SendEmail:`, JSON.stringify(emailResult));

        // Mark contacts as reminded so we don't re-send
        for (const { contact } of dueContacts) {
          await base44.asServiceRole.entities.Contact.update(contact.id, { follow_up_reminder_sent: true });
        }

        totalSent++;
      } catch (err) {
        console.error(`Failed to send to ${user.email}:`, err.message, JSON.stringify(err));
      }
    }

    return Response.json({ success: true, emailsSent: totalSent });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});