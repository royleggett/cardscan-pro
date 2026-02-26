import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

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

const getNextMilestone = (entries) => {
  return MILESTONES.find(m => m.entries > entries);
};

const getPotentialRewards = (currentEntries) => {
  return MILESTONES.filter(m => m.entries > currentEntries).slice(0, 3);
};

const formatRewardsList = (rewards) => {
  return rewards.map((r, i) => {
    let reward = `${r.entries} entries: ${r.badge}`;
    if (r.discount) reward += ` (${r.discount}% off)`;
    if (r.subscription) reward += ` (Free Year)`;
    return reward;
  }).join("\n");
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
      if (!userRecord.created_date) continue;

      const createdDate = new Date(userRecord.created_date);
      const now = new Date();
      
      // Calculate months since registration
      const monthsDiff = (now.getFullYear() - createdDate.getFullYear()) * 12 + 
                        (now.getMonth() - createdDate.getMonth());

      // Send reminder in month 11 (between 10 and 11 months)
      if (monthsDiff >= 10 && monthsDiff < 11) {
        const entries = userRecord.total_entries || 0;
        const nextMilestone = getNextMilestone(entries);
        const potentialRewards = getPotentialRewards(entries);

        if (nextMilestone && potentialRewards.length > 0) {
          const entriesNeeded = nextMilestone.entries - entries;
          
          const emailBody = `Hi ${userRecord.full_name || "there"}!

🎉 Almost a year with us! Great job!

You're doing amazing! You currently have ${entries} contributions and are ${entriesNeeded} entries away from unlocking the "${nextMilestone.badge}" tier${nextMilestone.discount ? ` and ${nextMilestone.discount}% off your subscription` : nextMilestone.subscription ? ` and a free year subscription` : ''}!

Keep up the momentum! Here's what you can unlock:

${formatRewardsList(potentialRewards)}

Every contribution counts. Add more places, scan business cards, and watch your rewards grow!

Keep contributing and you'll reach your next tier in no time!

Best regards,
The CardScanPro Team`;

          await base44.integrations.Core.SendEmail({
            to: userRecord.email,
            subject: "🏆 You're So Close to Your Next Reward! 🎉",
            body: emailBody,
            from_name: "CardScanPro Rewards"
          });

          emailsSent.push(userRecord.email);
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