
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  {
    auth: {
      persistSession: false,
    },
  }
);

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();
  
  if (!signature) {
    logStep("ERROR: No stripe signature");
    return new Response("No signature", { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
    );

    logStep("Webhook event received", { type: event.type, id: event.id });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Processing checkout.session.completed", { 
          sessionId: session.id, 
          metadata: session.metadata,
          mode: session.mode 
        });

        const userId = session.metadata?.user_id;
        if (!userId) {
          logStep("ERROR: No user_id in session metadata");
          return new Response("No user_id in metadata", { status: 400 });
        }

        // Update user's payment status in profiles table
        const { data, error } = await supabase
          .from("profiles")
          .upsert({
            user_id: userId,
            is_paid: true,
          })
          .select();

        if (error) {
          logStep("ERROR: Failed to update user profile", { error: error.message, userId });
          return new Response("Database error", { status: 500 });
        }

        logStep("Successfully updated user profile", { userId, data });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Processing customer.subscription.deleted", { 
          subscriptionId: subscription.id,
          customerId: subscription.customer 
        });

        // Find user by customer ID and set is_paid to false
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if (customer.deleted) {
          logStep("ERROR: Customer was deleted");
          return new Response("Customer deleted", { status: 400 });
        }

        const { data, error } = await supabase
          .from("profiles")
          .update({ is_paid: false })
          .eq("user_id", (customer as any).metadata?.user_id)
          .select();

        if (error) {
          logStep("ERROR: Failed to update user profile on cancellation", { 
            error: error.message, 
            customerId: subscription.customer 
          });
          return new Response("Database error", { status: 500 });
        }

        logStep("Successfully updated user profile on cancellation", { 
          customerId: subscription.customer, 
          data 
        });
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    logStep("ERROR: Webhook processing failed", { 
      error: error instanceof Error ? error.message : String(error) 
    });
    return new Response("Webhook error", { status: 400 });
  }
});
