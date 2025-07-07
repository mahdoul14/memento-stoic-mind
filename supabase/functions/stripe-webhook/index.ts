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

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });
    
    // Get the raw body and signature
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    logStep("Verifying webhook signature");
    
    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      return new Response(`Webhook signature verification failed: ${err.message}`, {
        status: 400,
        headers: corsHeaders,
      });
    }

    logStep("Webhook signature verified", { eventType: event.type });

    // Initialize Supabase client with service role key to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Processing checkout.session.completed", { 
          sessionId: session.id, 
          customerId: session.customer,
          mode: session.mode
        });

        if (session.customer && typeof session.customer === 'string') {
          const customerId = session.customer;
          
          // Determine payment type based on session mode
          let paymentType = "unknown";
          if (session.mode === "subscription") {
            paymentType = "monthly";
          } else if (session.mode === "payment") {
            paymentType = "lifetime";
          }
          
          logStep("Determined payment type", { mode: session.mode, paymentType });
          
          // Update profile with payment information
          const { data, error } = await supabaseClient
            .from('profiles')
            .update({ 
              is_paid: true,
              payment_type: paymentType,
              payment_date: new Date().toISOString(),
              stripe_session_id: session.id
            })
            .eq('stripe_customer_id', customerId);

          if (error) {
            logStep("Error updating payment status to paid", { error: error.message, customerId });
            throw error;
          }

          logStep("Successfully updated payment status to paid", { 
            customerId, 
            paymentType,
            sessionId: session.id,
            affectedRows: data 
          });
        } else {
          logStep("No customer ID found in session", { sessionId: session.id });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Processing customer.subscription.deleted", { 
          subscriptionId: subscription.id, 
          customerId: subscription.customer 
        });

        if (subscription.customer && typeof subscription.customer === 'string') {
          const customerId = subscription.customer;
          
          // Update is_paid to false for subscription cancellation (keep lifetime payments)
          const { data, error } = await supabaseClient
            .from('profiles')
            .update({ is_paid: false })
            .eq('stripe_customer_id', customerId)
            .eq('payment_type', 'monthly'); // Only affect monthly subscriptions

          if (error) {
            logStep("Error updating payment status to unpaid", { error: error.message, customerId });
            throw error;
          }

          logStep("Successfully updated monthly subscription to unpaid", { customerId, affectedRows: data });
        } else {
          logStep("No customer ID found in subscription", { subscriptionId: subscription.id });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Processing invoice.payment_failed", { 
          invoiceId: invoice.id, 
          customerId: invoice.customer 
        });

        if (invoice.customer && typeof invoice.customer === 'string') {
          const customerId = invoice.customer;
          
          // Update is_paid to false for failed payments (only monthly subscriptions)
          const { data, error } = await supabaseClient
            .from('profiles')
            .update({ is_paid: false })
            .eq('stripe_customer_id', customerId)
            .eq('payment_type', 'monthly'); // Only affect monthly subscriptions

          if (error) {
            logStep("Error updating payment status to unpaid", { error: error.message, customerId });
            throw error;
          }

          logStep("Successfully updated payment status to unpaid", { customerId, affectedRows: data });
        } else {
          logStep("No customer ID found in invoice", { invoiceId: invoice.id });
        }
        break;
      }

      default:
        logStep("Unhandled event type", { eventType: event.type });
    }

    logStep("Webhook processed successfully");
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-webhook", { 
      message: errorMessage, 
      stack: error instanceof Error ? error.stack : undefined 
    });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: "Check the function logs for more information"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
