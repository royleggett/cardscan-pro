import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';
import Stripe from 'npm:stripe@18.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')
    );

    const base44 = createClientFromRequest(req);
    const subscriptions = base44.entities.Subscription;
    const users = base44.entities.User;

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userEmail = subscription.metadata?.user_email;
        const tier = subscription.metadata?.tier;

        if (userEmail && tier) {
          // Find or create subscription record
          const existing = await subscriptions.filter({ user_email: userEmail });

          if (existing.length > 0) {
            await subscriptions.update(existing[0].id, {
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer,
              tier,
              status: subscription.status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
            });
          } else {
            await subscriptions.create({
              user_email: userEmail,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer,
              tier,
              status: subscription.status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
            });
          }

          // Update user subscription tier
          await base44.asServiceRole.auth.updateMe({
            subscription_tier: tier
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userEmail = subscription.metadata?.user_email;

        if (userEmail) {
          const existing = await subscriptions.filter({ user_email: userEmail });
          if (existing.length > 0) {
            await subscriptions.update(existing[0].id, {
              status: 'cancelled'
            });
          }

          // Revert to free tier
          // Note: We can't update the user directly from webhook, so we'll mark subscription as cancelled
          // The frontend will check subscription status and update accordingly
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const userEmail = invoice.metadata?.user_email;

        if (userEmail) {
          const existing = await subscriptions.filter({ user_email: userEmail });
          if (existing.length > 0) {
            await subscriptions.update(existing[0].id, {
              status: 'past_due'
            });
          }
        }
        break;
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
});