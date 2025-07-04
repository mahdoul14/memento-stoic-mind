
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

    const requestBody = await req.json();
    const { priceType, productId } = requestBody;
    logStep("Request received", { priceType, productId });

    // Validate input
    if (!priceType && !productId) {
      throw new Error("Either priceType or productId is required");
    }

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

    const origin = req.headers.get("origin") || "http://localhost:3000";
    let sessionConfig;

    // Map priceType to actual Stripe product IDs
    let stripeProductId;
    let mode = "subscription";

    if (priceType === 'monthly') {
      stripeProductId = "prod_ScQx7NIRno1qid"; // £9/month
      mode = "subscription";
    } else if (priceType === 'lifetime') {
      stripeProductId = "prod_ScQxRn7u0bDsBg"; // £79 one-time
      mode = "payment";
    } else if (productId) {
      // If productId is provided directly, use it
      stripeProductId = productId;
      mode = "subscription"; // Default, but could be overridden
    } else {
      throw new Error("Invalid price type or product ID");
    }

    logStep("Using Stripe product", { productId: stripeProductId, mode });

    // Get the product and its default price
    const product = await stripe.products.retrieve(stripeProductId);
    if (!product.default_price) {
      throw new Error(`Product ${stripeProductId} has no default price`);
    }

    logStep("Retrieved product", { name: product.name, defaultPrice: product.default_price });

    sessionConfig = {
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: [{
        price: product.default_price as string,
        quantity: 1,
      }],
      mode: mode as "subscription" | "payment",
      success_url: `${origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'required' as const,
    };

    logStep("Creating checkout session", { config: sessionConfig });

    const session = await stripe.checkout.sessions.create(sessionConfig);

    logStep("Checkout session created successfully", { 
      sessionId: session.id, 
      url: session.url,
      mode: session.mode 
    });

    return new Response(JSON.stringify({ 
      url: session.url,
      sessionId: session.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { 
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
