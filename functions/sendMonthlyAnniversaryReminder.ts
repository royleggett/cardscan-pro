import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

const MILESTONES = [
  { entries: 25, badge: "Starter" },
  { entries: 50, badge: "Contributor" },
  { entries: 75, badge: "Bronze Member", discount: 5 },
  { entries: 100, badge: "Silver Member", discount: 5 },
  { entries: 150, badge: "Gold Member", discount: 10 },
  { entries: 200, badge: "Platinum", discount: 20 },
  { entries: 500, badge: "Elite", discount: 50 },
  { entries: 1000, badge: "VIP", subscription: "free_year" }
];

const getNextMilestone = (entries) => MILESTONES.find(m => m.entries > entries);
const getPotentialRewards = (currentEntries) => MILESTONES.filter(m => m.entries > currentEntries).slice(0, 3);

const buildHtmlEmail = (name, entries, nextMilestone, potentialRewards) => {
  const entriesNeeded = nextMilestone.entries - entries;
  const progressPct = Math.round((entries / nextMilestone.entries) * 100);
  const nextRewardDesc = nextMilestone.discount
    ? `${nextMilestone.discount}% off your subscription`
    : nextMilestone.subscription
    ? `a free year subscription`
    : `the ${nextMilestone.badge} badge`;

  const rewardRows = potentialRewards.map(r => {
    const benefit = r.discount ? `${r.discount}% off` : r.subscription ? `Free Year` : `Badge`;
    return `
      <tr>
        <td style="padding:10px 0; border-bottom:1px solid #f0f0f0; color:#444; font-size:15px;">🏅 <strong>${r.badge}</strong></td>
        <td style="padding:10px 0; border-bottom:1px solid #f0f0f0; color:#666; font-size:14px; text-align:right;">${r.entries} entries · ${benefit}</td>
      </tr>`;
  }).join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:36px 32px;text-align:center;">
            <div style="font-size:40px;margin-bottom:12px;">🏆</div>
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">You're Almost There!</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">Just ${entriesNeeded} more entries to unlock ${nextRewardDesc}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 20px;color:#333;font-size:16px;line-height:1.6;">Hi <strong>${name}</strong>,</p>
            <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.7;">
              It's nearly been a year since you joined CardScan Pro — and what a journey it's been! You've made
              <strong>${entries} contributions</strong> so far, and you're so close to your next reward.
            </p>

            <!-- Progress Bar -->
            <div style="background:#f0f4ff;border-radius:12px;padding:20px;margin-bottom:28px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span style="color:#3b82f6;font-weight:600;font-size:14px;">Progress to ${nextMilestone.badge}</span>
                <span style="color:#666;font-size:14px;">${entries} / ${nextMilestone.entries}</span>
              </div>
              <div style="background:#e2e8f0;border-radius:99px;height:10px;overflow:hidden;">
                <div style="background:linear-gradient(90deg,#3b82f6,#8b5cf6);height:10px;width:${progressPct}%;border-radius:99px;"></div>
              </div>
              <p style="margin:10px 0 0;color:#666;font-size:13px;text-align:center;">${progressPct}% of the way there — keep going! 💪</p>
            </div>

            <!-- Upcoming Rewards -->
            <h3 style="margin:0 0 12px;color:#333;font-size:16px;font-weight:700;">🎁 Upcoming Rewards You Can Unlock</h3>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${rewardRows}
            </table>

            <p style="margin:28px 0 24px;color:#555;font-size:15px;line-height:1.7;">
              Every business card you scan and every place you add brings you closer. 
              Don't let this year go by without claiming what you've earned!
            </p>

            <!-- CTA Button -->
            <div style="text-align:center;margin-bottom:8px;">
              <a href="https://cardscan-pro.com" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#ffffff;font-size:16px;font-weight:600;padding:14px 36px;border-radius:99px;text-decoration:none;">Open CardScan Pro →</a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;color:#999;font-size:13px;">You're receiving this because you're a CardScan Pro member.</p>
            <p style="margin:6px 0 0;color:#999;font-size:13px;">© 2025 CardScan Pro. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== "admin") {
      return Response.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const allUsers = await base44.entities.User.list();
    const emailsSent = [];

    for (const userRecord of allUsers) {
      if (!userRecord.created_date || !userRecord.email) continue;

      const createdDate = new Date(userRecord.created_date);
      const now = new Date();
      const monthsDiff = (now.getFullYear() - createdDate.getFullYear()) * 12 +
                         (now.getMonth() - createdDate.getMonth());

      if (monthsDiff >= 10 && monthsDiff < 11) {
        const entries = userRecord.total_entries || 0;
        const nextMilestone = getNextMilestone(entries);
        const potentialRewards = getPotentialRewards(entries);

        if (nextMilestone && potentialRewards.length > 0) {
          const name = userRecord.full_name || "there";
          const html = buildHtmlEmail(name, entries, nextMilestone, potentialRewards);

          try {
            await base44.asServiceRole.integrations.Core.SendEmail({
              from_name: "CardScan Pro Rewards",
              to: userRecord.email,
              subject: "🏆 You're So Close to Your Next Reward!",
              body: html
            });
            emailsSent.push(userRecord.email);
          } catch (err) {
            console.error(`Failed to send to ${userRecord.email}:`, err.message);
          }
        }
      }
    }

    return Response.json({
      success: true,
      message: `Sent reminders to ${emailsSent.length} users`,
      emails_sent: emailsSent
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});