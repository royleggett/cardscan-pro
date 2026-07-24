import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

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

      // Build email body
      let emailBody = `Hi,\n\nYou have ${dueContacts.length} contact${dueContacts.length !== 1 ? "s" : ""} due for follow-up today:\n\n`;

      for (const [label, items] of Object.entries(grouped)) {
        emailBody += `${label} Leads:\n`;
        for (const { contact, exhibition } of items) {
          emailBody += `  • ${contact.full_name}${contact.company ? ` (${contact.company})` : ""} — ${exhibition.name}`;
          if (contact.email) emailBody += ` — ${contact.email}`;
          if (contact.phone_mobile) emailBody += ` — ${contact.phone_mobile}`;
          emailBody += "\n";
        }
        emailBody += "\n";
      }

      emailBody += "Log in to CardScan-Pro to follow up.\n\nGood luck!";

      const htmlBody = `<pre style="font-family:sans-serif;white-space:pre-wrap;">${emailBody}</pre>`;

      try {
        const emailResult = await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: "CardScan-Pro",
          to: user.email,
          subject: `📋 Follow-up reminder: ${dueContacts.length} lead${dueContacts.length !== 1 ? "s" : ""} due today`,
          body: htmlBody
        });
        console.log(`Email sent to ${user.email}:`, JSON.stringify(emailResult));

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