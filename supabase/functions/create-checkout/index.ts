
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: STRIPE_SECRET_KEY not found");
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    logStep("Stripe key verified");

    const { priceType } = await req.json();
    logStep("Request received", { priceType });

    // Try to get authenticated user, but don't require it for checkout
    let user = null;
    let customerEmail = "guest@example.com"; // Default for guest checkout
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    try {
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        if (data.user?.email) {
          user = data.user;
          customerEmail = user.email;
          logStep("User authenticated", { email: user.email });
        }
      }
    } catch (error) {
      logStep("No authentication or auth failed, proceeding as guest");
    }

    if (!user) {
      logStep("Proceeding with guest checkout", { email: customerEmail });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check if customer already exists (only for authenticated users)
    let customerId;
    if (user) {
      try {
        const customers = await stripe.customers.list({ email: user.email, limit: 1 });
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
          logStep("Existing customer found", { customerId });
        }
      } catch (error) {
        logStep("Error checking existing customer", { error: error.message });
      }
    }

    // Define pricing based on your actual product
    let lineItems;
    let mode = "subscription";
    
    if (priceType === 'monthly') {
      lineItems = [{
        price_data: {
          currency: "gbp",
          product_data: { name: "Monthly Access" },
          unit_amount: 900, // £9.00
          recurring: { interval: "month" },
        },
        quantity: 1,
      }];
    } else if (priceType === 'lifetime') {
      // Use your actual product price ID for the lifetime plan
      lineItems = [{
        price: "price_1QQo7zKLl9pHyQy2ScQxRn7u0bDsBg", // Your product price ID
        quantity: 1,
      }];
    } else {
      throw new Error("Invalid price type");
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    const sessionConfig = {
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: lineItems,
      mode: mode,
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'required' as const,
    };

    logStep("Creating checkout session", { config: sessionConfig });

    const session = await stripe.checkout.sessions.create(sessionConfig);

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage, stack: error instanceof Error ? error.stack : undefined });
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: "Check the function logs for more information"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
