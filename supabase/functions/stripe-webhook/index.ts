import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Create Supabase client with service role to bypass RLS
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      throw new Error("No stripe signature found");
    }

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? ""
      );
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    logStep("Event received", { type: event.type, id: event.id });

    // Handle successful payments
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      logStep("Checkout session completed", { sessionId: session.id, customerEmail: session.customer_email });

      if (session.customer) {
        // Get customer details from Stripe
        const customer = await stripe.customers.retrieve(session.customer as string);
        const customerEmail = typeof customer !== "string" ? customer.email : null;

        if (customerEmail) {
          logStep("Updating user payment status", { email: customerEmail });

          // Update is_paid to true for the user
          const { error } = await supabase
            .from("profiles")
            .update({ is_paid: true })
            .eq("user_id", (
              await supabase.auth.admin.getUserByEmail(customerEmail)
            ).data.user?.id);

          if (error) {
            logStep("Error updating profile", { error: error.message });
            throw error;
          }

          logStep("Successfully updated user payment status", { email: customerEmail });
        }
      }
    }

    // Handle successful subscription creation
    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      const customer = await stripe.customers.retrieve(subscription.customer as string);
      const customerEmail = typeof customer !== "string" ? customer.email : null;

      if (customerEmail && subscription.status === "active") {
        logStep("Updating subscription status", { email: customerEmail, subscriptionId: subscription.id });

        const { error } = await supabase
          .from("profiles")
          .update({ is_paid: true })
          .eq("user_id", (
            await supabase.auth.admin.getUserByEmail(customerEmail)
          ).data.user?.id);

        if (error) {
          logStep("Error updating subscription status", { error: error.message });
          throw error;
        }

        logStep("Successfully updated subscription status", { email: customerEmail });
      }
    }

    // Handle subscription cancellation
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customer = await stripe.customers.retrieve(subscription.customer as string);
      const customerEmail = typeof customer !== "string" ? customer.email : null;

      if (customerEmail) {
        logStep("Updating cancelled subscription", { email: customerEmail, subscriptionId: subscription.id });

        const { error } = await supabase
          .from("profiles")
          .update({ is_paid: false })
          .eq("user_id", (
            await supabase.auth.admin.getUserByEmail(customerEmail)
          ).data.user?.id);

        if (error) {
          logStep("Error updating cancelled subscription", { error: error.message });
          throw error;
        }

        logStep("Successfully updated cancelled subscription", { email: customerEmail });
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-webhook", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: "Check the function logs for more information"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});