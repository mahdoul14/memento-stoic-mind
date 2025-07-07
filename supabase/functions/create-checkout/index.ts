
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    const { priceType } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    // Define prices based on type
    const prices = {
      monthly: {
        unit_amount: 900, // £9.00 in pence
        recurring: { interval: "month" as const },
        mode: "subscription" as const
      },
      lifetime: {
        unit_amount: 7900, // £79.00 in pence  
        recurring: undefined,
        mode: "payment" as const
      }
    };

    const selectedPrice = prices[priceType as keyof typeof prices];
    if (!selectedPrice) {
      throw new Error("Invalid price type");
    }

    const sessionConfig: any = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: { 
              name: priceType === 'monthly' ? "Premium Monthly Subscription" : "Premium Lifetime Access" 
            },
            unit_amount: selectedPrice.unit_amount,
            ...(selectedPrice.recurring ? { recurring: selectedPrice.recurring } : {})
          },
          quantity: 1,
        },
      ],
      mode: selectedPrice.mode,
      success_url: `${origin}/dashboard`,
      cancel_url: `${origin}/dashboard`,
      metadata: {
        user_id: user.id,
        price_type: priceType
      }
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Error creating checkout:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
