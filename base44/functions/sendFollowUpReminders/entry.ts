import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';
import { sendGmail } from '../../shared/gmail.js';

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

      // Build plain-text email body (plain text for best deliverability with Sky/Yahoo)
      let textBody = `Follow-up Reminder\n\nYou have ${dueContacts.length} contact${dueContacts.length !== 1 ? "s" : ""} due for follow-up:\n`;

      for (const [label, items] of Object.entries(grouped)) {
        textBody += `\n${label} Leads\n`;
        for (const { contact, exhibition } of items) {
          const contactInfo = [
            contact.company || null,
            exhibition?.name || null,
            contact.email || null,
            contact.phone_mobile || null
          ].filter(Boolean).join(" | ");

          const yesUrl = `${appUrl}/api/functions/updateFollowUpStatus?contact_id=${contact.id}&action=yes`;
          const noUrl = `${appUrl}/api/functions/updateFollowUpStatus?contact_id=${contact.id}&action=no`;

          textBody += `\n- ${contact.full_name}`;
          if (contactInfo) textBody += `\n  ${contactInfo}`;
          textBody += `\n  Have you contacted them?`;
          textBody += `\n  YES: <${yesUrl}>`;
          textBody += `\n  NO:  <${noUrl}>\n`;
        }
      }

      textBody += `\nLog in to CardScan-Pro to manage your contacts.`;

      try {
        const emailResult = await sendGmail(base44, {
          to: user.email,
          subject: `Follow-up reminder: ${dueContacts.length} lead${dueContacts.length !== 1 ? "s" : ""} due today`,
          text: textBody,
          fromName: "CardScan-Pro"
        });

        console.log(`Email sent to ${user.email} via Gmail:`, JSON.stringify(emailResult));

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